from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
from xgboost import XGBClassifier
from pathlib import Path
import json

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "Models"

# load preprocessing tools
scaler = joblib.load(MODELS_DIR / "scaler.pkl")
feature_columns = joblib.load(MODELS_DIR / "feature_columns.pkl")

# load base models
lr_model = joblib.load(MODELS_DIR / "logistic_regression_model.pkl")
rf_model = joblib.load(MODELS_DIR / "random_forest_model.pkl")

xgb_model = XGBClassifier()
xgb_model.load_model(MODELS_DIR / "xgboost_model.json")

# load ensemble
ensemble_model = joblib.load(MODELS_DIR / "ensemble.pkl")

def _normalize(values):
    arr = np.array(values, dtype=float)
    total = np.sum(arr)
    if total <= 0:
        return np.zeros_like(arr)
    return arr / total

def _combined_importance():
    lr_importance = np.abs(getattr(lr_model, "coef_", np.zeros((1, len(feature_columns))))[0])
    rf_importance = np.array(getattr(rf_model, "feature_importances_", np.zeros(len(feature_columns))))
    xgb_importance = np.array(getattr(xgb_model, "feature_importances_", np.zeros(len(feature_columns))))

    return (
        _normalize(lr_importance)
        + _normalize(rf_importance)
        + _normalize(xgb_importance)
    ) / 3.0

def _ensemble_meta_weights():
    # Stacking model is trained on [lr_prob, rf_prob, xgb_prob]
    stack_names = ["Logistic Regression Signal", "Random Forest Signal", "XGBoost Signal"]

    coef = getattr(ensemble_model, "coef_", None)
    if coef is None or len(coef) == 0:
        return [{"signal": name, "weight": None} for name in stack_names]

    weights = coef[0]
    output = []
    for idx, name in enumerate(stack_names):
        weight = float(weights[idx]) if idx < len(weights) else None
        output.append({"signal": name, "weight": weight})

    return output

def _model_factor_analysis(x_scaled_row):
    combined_importance = _combined_importance()

    contribution_score = np.abs(x_scaled_row) * combined_importance
    top_indices = np.argsort(contribution_score)[::-1][:3]

    factors = []
    for idx in top_indices:
        if contribution_score[idx] <= 0:
            continue
        direction = "higher" if x_scaled_row[idx] >= 0 else "lower"
        factors.append(f"{feature_columns[idx]} is {direction} than baseline and strongly influenced prediction")

    return factors

def _model_recommendation(risk_label, probability):
    if risk_label == "High Risk":
        return "High predicted risk. Please consult a liver specialist and schedule follow-up lab tests soon."
    if risk_label == "Moderate Risk":
        return "Moderate predicted risk. Consider physician review and lifestyle intervention with repeat screening."
    return "Low predicted risk. Maintain healthy lifestyle and continue periodic monitoring."

def _load_performance_artifact():
    artifact_path = MODELS_DIR / "performance_metrics.example.json"
    if not artifact_path.exists():
        return None

    with open(artifact_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.route("/")
def home():
    return "NAFLD model running"

@app.route("/performance", methods=["GET"])
def performance():
    try:
        combined_importance = _combined_importance()
        top_indices = np.argsort(combined_importance)[::-1][:5]
        ensemble_fields = _ensemble_meta_weights()
        model_intercept = getattr(ensemble_model, "intercept_", None)
        intercept_value = float(model_intercept[0]) if model_intercept is not None and len(model_intercept) else None

        top_features = [
            {
                "feature": feature_columns[idx],
                "importance": float(combined_importance[idx])
            }
            for idx in top_indices
        ]

        artifact = _load_performance_artifact()

        if artifact:
            metrics = artifact.get("metrics", {})
            confusion = artifact.get("confusionMatrix", {})
            model_info = artifact.get("modelInfo", {})

            metric_values = [
                metrics.get("accuracy"),
                metrics.get("precision"),
                metrics.get("recall"),
                metrics.get("f1Score")
            ]
            confusion_values = [
                confusion.get("tp"),
                confusion.get("fp"),
                confusion.get("fn"),
                confusion.get("tn")
            ]

            has_non_placeholder_metrics = any(
                (value is not None) and (float(value) != 0.0) for value in metric_values
            )
            has_non_placeholder_confusion = any(
                (value is not None) and (float(value) != 0.0) for value in confusion_values
            )

            metrics_available = has_non_placeholder_metrics or has_non_placeholder_confusion

            return jsonify({
                "metricsAvailable": metrics_available,
                "metrics": {
                    "accuracy": metrics.get("accuracy") if metrics_available else None,
                    "precision": metrics.get("precision") if metrics_available else None,
                    "recall": metrics.get("recall") if metrics_available else None,
                    "f1Score": metrics.get("f1Score") if metrics_available else None
                },
                "confusionMatrix": {
                    "tp": confusion.get("tp") if metrics_available else None,
                    "fp": confusion.get("fp") if metrics_available else None,
                    "fn": confusion.get("fn") if metrics_available else None,
                    "tn": confusion.get("tn") if metrics_available else None
                },
                "modelInfo": {
                    "featureCount": int(len(feature_columns)),
                    "inputFields": list(feature_columns),
                    "baseModels": model_info.get("baseModels", ["Logistic Regression", "Random Forest", "XGBoost"]),
                    "metaModel": model_info.get("metaModel", "Logistic Regression (Stacking)"),
                    "ensembleFields": ensemble_fields,
                    "ensembleIntercept": intercept_value,
                    "modelVersion": model_info.get("modelVersion"),
                    "lastTrained": model_info.get("lastTrained"),
                    "dataset": model_info.get("dataset"),
                    "topFeatures": top_features
                },
                "message": (
                    artifact.get("message", "Performance metrics loaded from artifact file.")
                    if metrics_available
                    else "Performance artifact found, but values look like placeholders. Generate real metrics from evaluation data."
                ),
                "artifactLoaded": metrics_available
            })

        # Validation-set metrics are not available in this deployed package.
        # Return explicit nulls with status so UI can avoid fake placeholders.
        return jsonify({
            "metricsAvailable": False,
            "metrics": {
                "accuracy": None,
                "precision": None,
                "recall": None,
                "f1Score": None
            },
            "confusionMatrix": {
                "tp": None,
                "fp": None,
                "fn": None,
                "tn": None
            },
            "modelInfo": {
                "featureCount": int(len(feature_columns)),
                "inputFields": list(feature_columns),
                "baseModels": ["Logistic Regression", "Random Forest", "XGBoost"],
                "metaModel": "Logistic Regression (Stacking)",
                "ensembleFields": ensemble_fields,
                "ensembleIntercept": intercept_value,
                "topFeatures": top_features
            },
            "message": "Validation metrics are not packaged with deployed model artifacts.",
            "artifactLoaded": False
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    try:

        # arrange features in correct order
        input_data = [data[col] for col in feature_columns]

        X = np.array(input_data).reshape(1,-1)

        # scale input
        X_scaled = scaler.transform(X)

        # base model probabilities
        lr_prob = lr_model.predict_proba(X_scaled)[:,1]
        rf_prob = rf_model.predict_proba(X_scaled)[:,1]
        xgb_prob = xgb_model.predict_proba(X_scaled)[:,1]

        # stacking input
        stack_input = np.column_stack((lr_prob, rf_prob, xgb_prob))

        # final prediction
        prediction = ensemble_model.predict(stack_input)[0]
        probability = ensemble_model.predict_proba(stack_input)[0][1]

        probability_percent = float(probability) * 100.0
        if probability_percent >= 70:
            risk_label = "High Risk"
        elif probability_percent >= 40:
            risk_label = "Moderate Risk"
        else:
            risk_label = "Low Risk"

        factors = _model_factor_analysis(X_scaled[0])
        recommendation = _model_recommendation(risk_label, probability_percent)

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability),
            "riskLabel": risk_label,
            "factors": factors,
            "recommendation": recommendation,
            "modelSignals": {
                "lrProbability": float(lr_prob[0]),
                "rfProbability": float(rf_prob[0]),
                "xgbProbability": float(xgb_prob[0])
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)