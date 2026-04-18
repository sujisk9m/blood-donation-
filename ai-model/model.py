import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Sample dataset
data = {
    'age': [25, 40, 30, 50],
    'last_donation_days': [90, 30, 120, 10],
    'eligible': [1, 0, 1, 0]
}

df = pd.DataFrame(data)

X = df[['age', 'last_donation_days']]
y = df['eligible']

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "model.pkl")