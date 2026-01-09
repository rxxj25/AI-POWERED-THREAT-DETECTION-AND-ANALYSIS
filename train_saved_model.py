import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import warnings
import os

warnings.filterwarnings('ignore')

def main():
    print("Loading datasets...")
    try:
        # Using the file in the current directory
        df = pd.read_csv('Train_data.csv')
    except FileNotFoundError:
        print("Error: Train_data.csv not found.")
        return

    print(f"Total data shape: {df.shape}")

    # Separating features and target
    # Based on previous exploration, target is likely 'class' or last column
    target_col = 'class'
    if target_col not in df.columns:
        target_col = df.columns[-1]

    X = df.drop(target_col, axis=1)
    y = df[target_col]

    # Preprocessing
    print("Preprocessing...")
    
    # Identify categorical columns
    categorical_cols = X.select_dtypes(include=['object']).columns
    print(f"Categorical columns: {list(categorical_cols)}")

    # Encoding
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        # Ensure we handle all possible values by converting to string
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le

    # Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Splitting dataset
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Train Model
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc:.4f}")

    # Save Artifacts
    print("Saving artifacts...")
    artifacts = {
        'model': model,
        'scaler': scaler,
        'label_encoders': label_encoders,
        'feature_names': list(X.columns),
        'categorical_cols': list(categorical_cols),
        'accuracy': acc
    }
    
    # Ensure backend directory exists
    if not os.path.exists('backend'):
        os.makedirs('backend')
        
    joblib.dump(artifacts, 'backend/model_artifacts.pkg')
    print("Artifacts saved to backend/model_artifacts.pkg")

if __name__ == "__main__":
    main()
