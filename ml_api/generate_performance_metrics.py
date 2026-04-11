import argparse
import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score
from xgboost import XGBClassifier


def load_models(models_dir: Path):
    scaler = joblib.load(models_dir / "scaler.pkl")
    feature_columns = joblib.load(models_dir / "feature_columns.pkl")

    lr_model = joblib.load(models_dir / "logistic_regression_model.pkl")
    rf_model = joblib.load(models_dir / "random_forest_model.pkl")

    xgb_model = XGBClassifier()
    xgb_model.load_model(models_dir / "xgboost_model.json")

    ensemble_model = joblib.load(models_dir / "ensemble.pkl")

    return scaler, feature_columns, lr_model, rf_model, xgb_model, ensemble_model


def evaluate(data_path: Path, target_col: str, output_path: Path, model_version: str, dataset_name: str):
    base_dir = Path(__file__).resolve().parent
    models_dir = base_dir / "Models"

    scaler, feature_columns, lr_model, rf_model, xgb_model, ensemble_model = load_models(models_dir)

    df = pd.read_csv(data_path)

    missing_features = [col for col in feature_columns if col not in df.columns]
    if missing_features:
        raise ValueError(f"Missing feature columns in dataset: {missing_features}")

    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' was not found in dataset.")

    X = df[feature_columns].astype(float)
    y_true = df[target_col].astype(int)

    X_scaled = scaler.transform(X)

    lr_prob = lr_model.predict_proba(X_scaled)[:, 1]
    rf_prob = rf_model.predict_proba(X_scaled)[:, 1]
    xgb_prob = xgb_model.predict_proba(X_scaled)[:, 1]

    stack_input = np.column_stack((lr_prob, rf_prob, xgb_prob))
    y_pred = ensemble_model.predict(stack_input).astype(int)

    accuracy = float(accuracy_score(y_true, y_pred))
    precision = float(precision_score(y_true, y_pred, zero_division=0))
    recall = float(recall_score(y_true, y_pred, zero_division=0))
    f1 = float(f1_score(y_true, y_pred, zero_division=0))

    tn, fp, fn, tp = confusion_matrix(y_true, y_pred, labels=[0, 1]).ravel()

    payload = {
        "metrics": {
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1Score": f1,
        },
        "confusionMatrix": {
            "tp": int(tp),
            "fp": int(fp),
            "fn": int(fn),
            "tn": int(tn),
        },
        "modelInfo": {
            "modelVersion": model_version,
            "lastTrained": "Update from your training pipeline",
            "dataset": dataset_name,
            "baseModels": [
                "Logistic Regression",
                "Random Forest",
                "XGBoost",
            ],
            "metaModel": "Logistic Regression (Stacking)",
        },
        "message": "Performance metrics generated from the provided evaluation dataset.",
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    print(f"Saved metrics to: {output_path}")
    print(payload["metrics"])
    print(payload["confusionMatrix"])


def main():
    parser = argparse.ArgumentParser(description="Generate performance_metrics.example.json for the ensemble model.")
    parser.add_argument("--data", required=True, help="Path to evaluation CSV file.")
    parser.add_argument("--target", required=True, help="Target column name in CSV (0/1 labels).")
    parser.add_argument(
        "--out",
        default=str(Path(__file__).resolve().parent / "Models" / "performance_metrics.example.json"),
        help="Output path for performance metrics JSON.",
    )
    parser.add_argument("--model-version", default="v1.0.0", help="Model version string.")
    parser.add_argument("--dataset-name", default="NAFLD validation set", help="Dataset label for metadata.")

    args = parser.parse_args()

    evaluate(
        data_path=Path(args.data),
        target_col=args.target,
        output_path=Path(args.out),
        model_version=args.model_version,
        dataset_name=args.dataset_name,
    )


if __name__ == "__main__":
    main()
