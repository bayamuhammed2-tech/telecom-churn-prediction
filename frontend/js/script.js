// ============================================================
// TELECOM CHURN PREDICTION FRONTEND
// ============================================================


// ============================================================
// BACKEND API
// ============================================================

const API_URL =
    "https://telecom-churn-prediction-askw.onrender.com/predict";


// ============================================================
// HELPER: SET INPUT VALUE
// ============================================================

function setValue(id, value) {

    const input = document.getElementById(id);

    if (input) {
        input.value = value;
    }

}


// ============================================================
// LOW-RISK TEST CUSTOMER
// ============================================================

const lowRiskCustomer = {

    arpu_8: 450,

    offnet_mou_8: 120,

    loc_og_t2m_mou_7: 80,
    loc_og_t2m_mou_8: 85,

    loc_og_mou_7: 100,
    loc_og_mou_8: 110,

    total_og_mou_8: 150,

    loc_ic_t2m_mou_7: 70,
    loc_ic_t2m_mou_8: 75,

    loc_ic_mou_7: 90,
    loc_ic_mou_8: 95,

    total_ic_mou_7: 130,
    total_ic_mou_8: 140,

    total_rech_num_8: 8,
    total_rech_amt_8: 500,

    max_rech_amt_8: 100,
    last_day_rch_amt_8: 50,

    aon: 730,

    tenure_years: 2,
    tenure_months: 24,

    min_arpu: 400,
    recent_arpu: 450,
    arpu_change: 50,

    avg_incoming_usage: 135,
    recent_incoming_usage: 140,
    incoming_usage_change: 10,

    recent_outgoing_usage: 150,
    outgoing_usage_change: 15,

    recent_offnet_usage: 120,

    activity_decline: 20

};


// ============================================================
// HIGH-RISK TEST CUSTOMER
// ============================================================

const highRiskCustomer = {

    arpu_8: 20,

    offnet_mou_8: 2,

    loc_og_t2m_mou_7: 5,
    loc_og_t2m_mou_8: 1,

    loc_og_mou_7: 8,
    loc_og_mou_8: 2,

    total_og_mou_8: 3,

    loc_ic_t2m_mou_7: 4,
    loc_ic_t2m_mou_8: 1,

    loc_ic_mou_7: 6,
    loc_ic_mou_8: 1,

    total_ic_mou_7: 8,
    total_ic_mou_8: 2,

    total_rech_num_8: 1,
    total_rech_amt_8: 10,

    max_rech_amt_8: 10,
    last_day_rch_amt_8: 0,

    aon: 120,

    tenure_years: 0.33,
    tenure_months: 4,

    min_arpu: 10,
    recent_arpu: 20,
    arpu_change: -30,

    avg_incoming_usage: 5,
    recent_incoming_usage: 2,
    incoming_usage_change: -8,

    recent_outgoing_usage: 3,
    outgoing_usage_change: -10,

    recent_offnet_usage: 2,

    activity_decline: 40

};


// ============================================================
// FILL FORM
// ============================================================

function fillForm(customer) {

    Object.keys(customer).forEach(function (key) {

        setValue(
            key,
            customer[key]
        );

    });

}


// ============================================================
// LOW-RISK BUTTON
// ============================================================

const lowRiskBtn =
    document.getElementById("lowRiskBtn");

if (lowRiskBtn) {

    lowRiskBtn.addEventListener(
        "click",
        function () {

            fillForm(
                lowRiskCustomer
            );

            const message =
                document.getElementById(
                    "formMessage"
                );

            if (message) {

                message.textContent =
                    "🟢 Low-risk test customer loaded.";

                message.style.color =
                    "#166534";

            }

        }
    );

}


// ============================================================
// HIGH-RISK BUTTON
// ============================================================

const highRiskBtn =
    document.getElementById("highRiskBtn");

if (highRiskBtn) {

    highRiskBtn.addEventListener(
        "click",
        function () {

            fillForm(
                highRiskCustomer
            );

            const message =
                document.getElementById(
                    "formMessage"
                );

            if (message) {

                message.textContent =
                    "🔴 High-risk test customer loaded.";

                message.style.color =
                    "#991b1b";

            }

        }
    );

}


// ============================================================
// GET FORM
// ============================================================

const predictionForm =
    document.getElementById(
        "predictionForm"
    );


// ============================================================
// FORM SUBMISSION
// ============================================================

if (predictionForm) {

    predictionForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const message =
                document.getElementById(
                    "formMessage"
                );


            // --------------------------------------------
            // SHOW LOADING MESSAGE
            // --------------------------------------------

            if (message) {

                message.textContent =
                    "⏳ Analyzing customer...";

                message.style.color =
                    "#2563eb";

            }


            // --------------------------------------------
            // FEATURES REQUIRED BY MODEL
            // --------------------------------------------

            const featureNames = [

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

            ];


            // --------------------------------------------
            // CREATE JSON OBJECT
            // --------------------------------------------

            const customerData = {};


            for (
                const feature of featureNames
            ) {

                const input =
                    document.getElementById(
                        feature
                    );


                if (!input) {

                    console.error(
                        "Missing input:",
                        feature
                    );

                    continue;

                }


                const value =
                    input.value;


                if (
                    value === "" ||
                    value === null
                ) {

                    if (message) {

                        message.textContent =
                            `Please enter a value for ${feature}.`;

                        message.style.color =
                            "#dc2626";

                    }

                    input.focus();

                    return;

                }


                customerData[feature] =
                    Number(value);

            }


            // --------------------------------------------
            // SEND REQUEST TO FASTAPI
            // --------------------------------------------

            try {

                const response =
                    await fetch(
                        API_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    customerData
                                )

                        }
                    );


                // ----------------------------------------
                // CHECK RESPONSE
                // ----------------------------------------

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "API Error:",
                        errorText
                    );

                    throw new Error(
                        "The prediction server returned an error."
                    );

                }


                // ----------------------------------------
                // READ JSON
                // ----------------------------------------

                const result =
                    await response.json();


                console.log(
                    "Prediction result:",
                    result
                );


                // ----------------------------------------
                // SAVE RESULT
                // ----------------------------------------

                localStorage.setItem(
                    "predictionResult",
                    JSON.stringify(result)
                );


                // ----------------------------------------
                // GO TO RESULT PAGE
                // ----------------------------------------

                window.location.href =
                    "result.html";


            } catch (error) {

                console.error(
                    "Prediction error:",
                    error
                );


                if (message) {

                    message.textContent =
                        "❌ Unable to connect to the prediction server. Please try again.";

                    message.style.color =
                        "#dc2626";

                }

            }

        }
    );

}


// ============================================================
// RESULT PAGE
// ============================================================

const resultTitle =
    document.getElementById(
        "resultTitle"
    );


if (resultTitle) {

    const savedResult =
        localStorage.getItem(
            "predictionResult"
        );


    if (!savedResult) {

        resultTitle.textContent =
            "No Prediction Available";

    } else {

        try {

            const result =
                JSON.parse(
                    savedResult
                );


            displayResult(
                result
            );


        } catch (error) {

            console.error(
                "Result parsing error:",
                error
            );

        }

    }

}


// ============================================================
// DISPLAY RESULT
// ============================================================

function displayResult(result) {

    const icon =
        document.getElementById(
            "resultIcon"
        );

    const title =
        document.getElementById(
            "resultTitle"
        );

    const description =
        document.getElementById(
            "resultDescription"
        );

    const risk =
        document.getElementById(
            "riskLevel"
        );

    const probability =
        document.getElementById(
            "probabilityValue"
        );

    const probabilityBar =
        document.getElementById(
            "probabilityBar"
        );

    const prediction =
        document.getElementById(
            "predictionValue"
        );

    const riskValue =
        document.getElementById(
            "riskValue"
        );


    // --------------------------------------------
    // CONVERT PROBABILITY TO PERCENTAGE
    // --------------------------------------------

    const probabilityPercent =
        Number(result.probability) * 100;


    // --------------------------------------------
    // HIGH RISK
    // --------------------------------------------

    if (
        result.risk === "High"
    ) {

        icon.textContent =
            "⚠️";

        icon.style.background =
            "#fee2e2";

        title.textContent =
            "Customer is at High Risk";

        title.style.color =
            "#dc2626";

        description.textContent =
            "The model predicts that this customer is likely to churn. Consider taking retention action.";

        risk.textContent =
            "HIGH";

        risk.style.color =
            "#dc2626";

        probabilityBar.style.background =
            "#dc2626";

    }


    // --------------------------------------------
    // LOW RISK
    // --------------------------------------------

    else {

        icon.textContent =
            "✅";

        icon.style.background =
            "#dcfce7";

        title.textContent =
            "Customer is at Low Risk";

        title.style.color =
            "#16a34a";

        description.textContent =
            "The model predicts that this customer is likely to remain active.";

        risk.textContent =
            "LOW";

        risk.style.color =
            "#16a34a";

        probabilityBar.style.background =
            "#16a34a";

    }


    // --------------------------------------------
    // PROBABILITY
    // --------------------------------------------

    probability.textContent =
        probabilityPercent.toFixed(1) + "%";


    probabilityBar.style.width =
        probabilityPercent + "%";


    // --------------------------------------------
    // DETAILS
    // --------------------------------------------

    prediction.textContent =
        result.prediction === 1
            ? "Likely to Churn"
            : "Likely to Stay";


    riskValue.textContent =
        result.risk;

}