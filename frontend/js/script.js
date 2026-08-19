// ============================================================
// TELECOM CHURN PREDICTION FRONTEND
// ============================================================


const API_URL =
    "https://telecom-churn-prediction-askw.onrender.com/predict";


// ============================================================
// FEATURE ORDER
// MUST MATCH FASTAPI
// ============================================================

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


// ============================================================
// TEST DATA
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

function fillForm(data) {

    featureNames.forEach(function(feature) {

        const input =
            document.getElementById(feature);

        if (input && data[feature] !== undefined) {

            input.value =
                data[feature];

        }

    });

}


// ============================================================
// LOW RISK BUTTON
// ============================================================

const lowRiskBtn =
    document.getElementById("lowRiskBtn");

if (lowRiskBtn) {

    lowRiskBtn.addEventListener(
        "click",
        function() {

            fillForm(lowRiskCustomer);

            showMessage(
                "🟢 Low-risk example loaded.",
                "#16a34a"
            );

        }
    );

}


// ============================================================
// HIGH RISK BUTTON
// ============================================================

const highRiskBtn =
    document.getElementById("highRiskBtn");

if (highRiskBtn) {

    highRiskBtn.addEventListener(
        "click",
        function() {

            fillForm(highRiskCustomer);

            showMessage(
                "🔴 High-risk example loaded.",
                "#dc2626"
            );

        }
    );

}


// ============================================================
// MESSAGE
// ============================================================

function showMessage(message, color) {

    const element =
        document.getElementById("formMessage");

    if (!element) return;

    element.textContent = message;

    element.style.color = color;

}


// ============================================================
// FORM SUBMISSION
// ============================================================

const predictionForm =
    document.getElementById("predictionForm");


if (predictionForm) {

    predictionForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            showMessage(
                "⏳ Analyzing customer...",
                "#2563eb"
            );


            const customerData = {};


            // --------------------------------------------
            // COLLECT ALL 30 FEATURES
            // --------------------------------------------

            for (const feature of featureNames) {

                const input =
                    document.getElementById(feature);


                if (!input) {

                    console.error(
                        "Missing input:",
                        feature
                    );

                    continue;

                }


                if (input.value === "") {

                    showMessage(
                        `Please enter ${feature}.`,
                        "#dc2626"
                    );

                    input.focus();

                    return;

                }


                customerData[feature] =
                    Number(input.value);

            }


            // --------------------------------------------
            // SEND TO FASTAPI
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


                if (!response.ok) {

                    throw new Error(
                        "API returned an error."
                    );

                }


                const result =
                    await response.json();


                console.log(
                    "MODEL RESULT:",
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
                // OPEN RESULT PAGE
                // ----------------------------------------

                window.location.href =
                    "result.html";


            } catch (error) {

                console.error(error);

                showMessage(
                    "❌ Unable to connect to the prediction service. Please try again.",
                    "#dc2626"
                );

            }

        }
    );

}


// ============================================================
// RESULT PAGE
// ============================================================

const savedResult =
    localStorage.getItem(
        "predictionResult"
    );


if (
    savedResult &&
    document.getElementById("resultTitle")
) {

    try {

        const result =
            JSON.parse(savedResult);

        displayResult(result);

    } catch(error) {

        console.error(
            "Unable to read prediction result.",
            error
        );

    }

}


// ============================================================
// DISPLAY RESULT
// ============================================================

function displayResult(result) {

    const title =
        document.getElementById("resultTitle");

    const description =
        document.getElementById("resultDescription");

    const icon =
        document.getElementById("resultIcon");

    const risk =
        document.getElementById("riskLevel");

    const probability =
        document.getElementById("probabilityValue");

    const probabilityBar =
        document.getElementById("probabilityBar");

    const prediction =
        document.getElementById("predictionValue");

    const riskValue =
        document.getElementById("riskValue");

    const note =
        document.getElementById("resultNote");


    const probabilityPercent =
        Number(result.probability) * 100;


    probability.textContent =
        probabilityPercent.toFixed(1) + "%";


    probabilityBar.style.width =
        probabilityPercent + "%";


    prediction.textContent =
        result.prediction === 1
            ? "Likely to Churn"
            : "Likely to Stay";


    riskValue.textContent =
        result.risk;


    risk.textContent =
        result.risk;


    if (result.risk === "High") {

        icon.textContent = "⚠️";

        icon.style.background =
            "#fee2e2";

        title.textContent =
            "Customer is at High Risk";

        title.style.color =
            "#dc2626";

        description.textContent =
            "The model predicts that this customer has a higher likelihood of churning.";

        risk.style.color =
            "#dc2626";

        probabilityBar.style.background =
            "#dc2626";

        note.textContent =
            "This result indicates elevated churn risk based on the customer information provided.";

    } else {

        icon.textContent = "✅";

        icon.style.background =
            "#dcfce7";

        title.textContent =
            "Customer is at Low Risk";

        title.style.color =
            "#16a34a";

        description.textContent =
            "The model predicts that this customer is more likely to remain active.";

        risk.style.color =
            "#16a34a";

        probabilityBar.style.background =
            "#16a34a";

        note.textContent =
            "This result indicates lower churn risk based on the customer information provided.";

    }

}