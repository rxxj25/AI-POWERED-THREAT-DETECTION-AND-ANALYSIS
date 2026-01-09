from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Threat Detection API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to hold artifacts and data
model_artifacts = {}
test_data = None

@app.on_event("startup")
def load_artifacts():
    global model_artifacts, test_data
    try:
        # Load Model Artifacts
        print("Loading model artifacts...")
        model_artifacts = joblib.load("model_artifacts.pkg")
        print(f"Model loaded. Accuracy: {model_artifacts['accuracy']:.4f}")
        
        # Load Test Data for Simulation
        # Assuming Test_data.csv is in the parent directory relative to backend/
        # or we just assume it's in ../Test_data.csv
        test_data_path = "../Test_data.csv"
        if os.path.exists(test_data_path):
            print("Loading test data for simulation...")
            test_data = pd.read_csv(test_data_path)
            # Remove target column if it exists (though test data usually doesn't have it or we ignore it)
            # The prompt said Test_data.csv resulted in errors in run_model.py because it lacked labels, 
            # so we can just use it as is for features.
        else:
            print("Warning: Test_data.csv not found. Simulation might fail.")
            
    except Exception as e:
        print(f"Error loading artifacts: {e}")

class PredictionRequest(BaseModel):
    features: dict

@app.get("/")
def read_root():
    return {"status": "active", "model_accuracy": model_artifacts.get("accuracy", "N/A")}

@app.get("/simulate")
def simulate_traffic():
    """Returns a random row from the test data to simulate real-time traffic."""
    if test_data is None:
        raise HTTPException(status_code=404, detail="Test data not available")
    
    # Pick a random row
    random_row = test_data.sample(n=1).iloc[0]
    # Convert to dict
    return {"features": random_row.to_dict()}

@app.post("/predict")
def predict_threat(request: PredictionRequest):
    if 'model' not in model_artifacts:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        features = request.features
        
        # Prepare DataFrame
        df = pd.DataFrame([features])
        
        # Preprocessing using saved artifacts
        # 1. Label Encoding
        categorical_cols = model_artifacts['categorical_cols']
        label_encoders = model_artifacts['label_encoders']
        
        for col in categorical_cols:
            if col in df.columns:
                # Handle unknown categories by mapping to a default or handling exception
                # For simplicity, we stick to string conversion as done in training
                val = str(df[col].iloc[0])
                le = label_encoders[col]
                
                # Check if value is known
                if val in le.classes_:
                    df[col] = le.transform([val])
                else:
                    # Fallback for unknown: map to first class or 0 (common issue in prod)
                    # Ideally we'd have an 'unknown' class. 
                    # For now just use 0 to avoid crash
                    df[col] = 0 
            
        # 2. Reorder columns to match training
        df = df[model_artifacts['feature_names']]
        
        # 3. Scaling
        scaler = model_artifacts['scaler']
        X_scaled = scaler.transform(df)
        
        # Prediction
        model = model_artifacts['model']
        prediction = model.predict(X_scaled)[0]
        probability = model.predict_proba(X_scaled)[0].max()
        
        return {
            "prediction": prediction,
            "confidence": float(probability),
            "status": "Safe" if prediction == "normal" else "Threat Detected"
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
