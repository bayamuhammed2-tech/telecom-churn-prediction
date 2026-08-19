# Telecom Customer Churn Prediction

An end-to-end Machine Learning application that predicts whether a telecom customer is likely to churn.

The project combines:

- Machine Learning
- Feature Engineering
- Feature Selection
- Scikit-learn
- FastAPI
- HTML
- CSS
- JavaScript

---

## Project Overview

Customer churn is a major problem for telecom companies.

This project uses customer usage and behavioral data to predict the probability that a customer will leave the telecom service.

The system takes customer information from a web interface, sends it to a FastAPI backend, passes the data through a trained Machine Learning pipeline, and returns a churn prediction.

---

## Machine Learning Pipeline

The model was developed using the following process:

1. Load raw telecom customer data
2. Create the churn target
3. Remove identifier columns
4. Perform feature engineering
5. Remove month 9 features to prevent target leakage
6. Select numerical features
7. Remove features with excessive missing values
8. Split data into training and testing sets
9. Select the 30 most important features
10. Handle missing values using `SimpleImputer`
11. Scale features using `RobustScaler`
12. Train a Logistic Regression model
13. Evaluate the model
14. Save the complete pipeline using Joblib

---

## Machine Learning Model

The project uses:

**Logistic Regression**

with:

```python
max_iter=1000
class_weight="balanced"
random_state=42