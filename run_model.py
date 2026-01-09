import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.naive_bayes import GaussianNB
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, classification_report
import warnings

warnings.filterwarnings('ignore')

def main():
    print("Loading datasets...")
    # Train data has a header and a 'class' column
    try:
        df = pd.read_csv('Train_data.csv')
    except FileNotFoundError:
        print("Error: Train_data.csv not found.")
        return

    print(f"Total data shape: {df.shape}")

    # Separating features and target
    target_col = 'class'
    
    # Check if target column exists
    if target_col not in df.columns:
        # Fallback if header is weird, though we saw it has 'class'
        print(f"Warning: '{target_col}' column not found using header inference. Checking last column.")
        target_col = df.columns[-1]

    X = df.drop(target_col, axis=1)
    y = df[target_col]

    # Splitting dataset for evaluation
    print("Splitting data into Train (80%) and Validation (20%)...")
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

    # Preprocessing
    print("Preprocessing...")
    
    # Identify categorical columns
    categorical_cols = X_train.select_dtypes(include=['object']).columns
    print(f"Categorical columns: {list(categorical_cols)}")

    # Encoding
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        # combine to fit all categories
        combined_data = pd.concat([X_train[col], X_val[col]], axis=0)
        le.fit(combined_data.astype(str))
        
        X_train[col] = le.transform(X_train[col].astype(str))
        X_val[col] = le.transform(X_val[col].astype(str))
        label_encoders[col] = le

    # Scaling
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_val = scaler.transform(X_val)

    # Models
    models = {
        "Naive Bayes": GaussianNB(),
        "QDA": QuadraticDiscriminantAnalysis(),
        "MLP Classifier": MLPClassifier(hidden_layer_sizes=(100,), max_iter=300, random_state=42)
    }

    print("\nTraining and Evaluating Models...")
    
    results = []

    for name, model in models.items():
        print(f"\nRunning {name}...")
        try:
            model.fit(X_train, y_train)
            y_pred = model.predict(X_val)
            
            acc = accuracy_score(y_val, y_pred)
            print(f"Accuracy: {acc:.4f}")
            # print("Classification Report:")
            # print(classification_report(y_val, y_pred))
            
            results.append({
                'Model': name,
                'Accuracy': acc
            })
        except Exception as e:
            print(f"Failed to run {name}: {e}")

    print("\n--- Summary Results on Validation Set ---")
    results_df = pd.DataFrame(results)
    print(results_df)

    print("\nNote: 'Test_data.csv' was excluded from evaluation as it lacked target labels.")

if __name__ == "__main__":
    main()
