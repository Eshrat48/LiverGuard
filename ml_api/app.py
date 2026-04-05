from flask import Flask, request, jsonify
import numpy as np
import joblib
from xgboost import XGBClassifier

app = Flask(__name__)

# load preprocessing tools
scaler = joblib.load("models/scaler.pkl")
feature_columns = joblib.load("models/feature_columns.pkl")

# load base models
lr_model = joblib.load("models/logistic_regression_model.pkl")
rf_model = joblib.load("models/random_forest_model.pkl")

xgb_model = XGBClassifier()
xgb_model.load_model("models/xgboost_model.json")

# load ensemble
ensemble_model = joblib.load("models/ensemble.pkl")

@app.route("/")
def home():
    return "NAFLD model running"

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

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)