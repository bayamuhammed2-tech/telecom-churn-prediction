from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib


# ============================================================
# CREATE FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Telecom Churn Prediction API",
    description="API for predicting telecom customer churn",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================
# Allows our frontend to communicate with FastAPI
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

MODEL_PATH = (
    "models/churn_final_pipeline.joblib"
)

model = joblib.load(MODEL_PATH)


print("==============================================")
print("CHURN MODEL LOADED SUCCESSFULLY")
print("==============================================")

print(
    "Model expects:",
    model.n_features_in_,
    "features"
)


# ============================================================
# INPUT DATA SCHEMA
# ============================================================

class CustomerData(BaseModel):

    arpu_8: float

    offnet_mou_8: float

    loc_og_t2m_mou_7: float
    loc_og_t2m_mou_8: float

    loc_og_mou_7: float
    loc_og_mou_8: float

    total_og_mou_8: float

    loc_ic_t2m_mou_7: float
    loc_ic_t2m_mou_8: float

    loc_ic_mou_7: float
    loc_ic_mou_8: float

    total_ic_mou_7: float
    total_ic_mou_8: float

    total_rech_num_8: float
    total_rech_amt_8: float

    max_rech_amt_8: float
    last_day_rch_amt_8: float

    aon: float

    tenure_years: float
    tenure_months: float

    min_arpu: float
    recent_arpu: float
    arpu_change: float

    avg_incoming_usage: float
    recent_incoming_usage: float
    incoming_usage_change: float

    recent_outgoing_usage: float
    outgoing_usage_change: float

    recent_offnet_usage: float

    activity_decline: float


# ============================================================
# HOME ENDPOINT
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Telecom Churn Prediction API is running!",
        "model": "churn_final_pipeline.joblib",
        "features_required": model.n_features_in_
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": True,
        "features_required": model.n_features_in_
    }


# ============================================================
# PREDICTION ENDPOINT
# ============================================================

@app.post("/predict")
def predict(data: CustomerData):

    # --------------------------------------------------------
    # Convert Pydantic object to dictionary
    # --------------------------------------------------------

    customer = data.model_dump()


    # --------------------------------------------------------
    # IMPORTANT
    # --------------------------------------------------------
    # The order below MUST match the order used when
    # training the Logistic Regression model.
    # --------------------------------------------------------

    feature_order = [

        "arpu_8",

        "offnet_mou_8",

        "loc_og_t2m_mou_7",
        "loc_og_t2m_mou_8",

        "loc_og_mou_7",
        "loc_og_mou_8",

        "total_og_mou_8",

        "loc_ic_t2m_mou_7",
        "loc_ic_t2m_mou_8",

        "loc_ic_mou_7",
        "loc_ic_mou_8",

        "total_ic_mou_7",
        "total_ic_mou_8",

        "total_rech_num_8",
        "total_rech_amt_8",

        "max_rech_amt_8",
        "last_day_rch_amt_8",

        "aon",

        "tenure_years",
        "tenure_months",

        "min_arpu",
        "recent_arpu",
        "arpu_change",

        "avg_incoming_usage",
        "recent_incoming_usage",
        "incoming_usage_change",

        "recent_outgoing_usage",
        "outgoing_usage_change",

        "recent_offnet_usage",

        "activity_decline"
    ]


    # --------------------------------------------------------
    # Create model input
    # --------------------------------------------------------

    features = [
        customer[feature]
        for feature in feature_order
    ]


    # --------------------------------------------------------
    # Safety check
    # --------------------------------------------------------

    if len(features) != model.n_features_in_:

        return {
            "error": "Incorrect number of features",
            "received": len(features),
            "expected": model.n_features_in_
        }


    # --------------------------------------------------------
    # MAKE PREDICTION
    # --------------------------------------------------------

    prediction = model.predict(
        [features]
    )[0]


    # --------------------------------------------------------
    # CHURN PROBABILITY
    # --------------------------------------------------------

    probability = model.predict_proba(
        [features]
    )[0][1]


    # --------------------------------------------------------
    # RESULT
    # --------------------------------------------------------

    if prediction == 1:

        result = "Customer is likely to churn"

        risk = "High"

    else:

        result = "Customer is likely to stay"

        risk = "Low"


    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "prediction": int(prediction),

        "probability": round(
            float(probability),
            4
        ),

        "risk": risk,

        "result": result

    }