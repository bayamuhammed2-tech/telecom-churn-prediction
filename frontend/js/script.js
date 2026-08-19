// ============================================================
// CHURNAI - FRONTEND JAVASCRIPT
// ============================================================


// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// DOM READY
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    initializeAnimations();

    initializePredictionForm();

    loadPredictionResult();

});


// ============================================================
// SCROLL REVEAL ANIMATION
// ============================================================

function initializeAnimations() {

    const revealElements =
        document.querySelectorAll(".reveal");

    if (!revealElements.length) {
        return;
    }

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    revealElements.forEach(element => {

        observer.observe(element);

    });

}


// ============================================================
// PREDICTION FORM
// ============================================================

function initializePredictionForm() {

    const form =
        document.getElementById(
            "predictionForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await makePrediction();

        }
    );

}


// ============================================================
// GET INPUT VALUE
// ============================================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.error(
            `Input not found: ${id}`
        );

        return null;
    }


    const value =
        parseFloat(element.value);


    return value;
}


// ============================================================
// COLLECT CUSTOMER DATA
// ============================================================

function collectCustomerData() {

    return {

        arpu_8:
            getValue("arpu_8"),

        offnet_mou_8:
            getValue("offnet_mou_8"),

        loc_og_t2m_mou_7:
            getValue("loc_og_t2m_mou_7"),

        loc_og_t2m_mou_8:
            getValue("loc_og_t2m_mou_8"),

        loc_og_mou_7:
            getValue("loc_og_mou_7"),

        loc_og_mou_8:
            getValue("loc_og_mou_8"),

        total_og_mou_8:
            getValue("total_og_mou_8"),

        loc_ic_t2m_mou_7:
            getValue("loc_ic_t2m_mou_7"),

        loc_ic_t2m_mou_8:
            getValue("loc_ic_t2m_mou_8"),

        loc_ic_mou_7:
            getValue("loc_ic_mou_7"),

        loc_ic_mou_8:
            getValue("loc_ic_mou_8"),

        total_ic_mou_7:
            getValue("total_ic_mou_7"),

        total_ic_mou_8:
            getValue("total_ic_mou_8"),

        total_rech_num_8:
            getValue("total_rech_num_8"),

        total_rech_amt_8:
            getValue("total_rech_amt_8"),

        max_rech_amt_8:
            getValue("max_rech_amt_8"),

        last_day_rch_amt_8:
            getValue("last_day_rch_amt_8"),

        aon:
            getValue("aon"),

        tenure_years:
            getValue("tenure_years"),

        tenure_months:
            getValue("tenure_months"),

        min_arpu:
            getValue("min_arpu"),

        recent_arpu:
            getValue("recent_arpu"),

        arpu_change:
            getValue("arpu_change"),

        avg_incoming_usage:
            getValue("avg_incoming_usage"),

        recent_incoming_usage:
            getValue("recent_incoming_usage"),

        incoming_usage_change:
            getValue("incoming_usage_change"),

        recent_outgoing_usage:
            getValue("recent_outgoing_usage"),

        outgoing_usage_change:
            getValue("outgoing_usage_change"),

        recent_offnet_usage:
            getValue("recent_offnet_usage"),

        activity_decline:
            getValue("activity_decline")

    };

}


// ============================================================
// VALIDATE CUSTOMER DATA
// ============================================================

function validateCustomerData(data) {

    const missingFields = [];


    for (const [key, value] of Object.entries(data)) {

        if (
            value === null ||
            Number.isNaN(value)
        ) {

            missingFields.push(key);

        }

    }


    if (missingFields.length > 0) {

        alert(
            "Please complete all fields before making a prediction."
        );

        console.warn(
            "Missing fields:",
            missingFields
        );

        return false;
    }


    return true;

}


// ============================================================
// MAKE PREDICTION
// ============================================================

async function makePrediction() {

    const data =
        collectCustomerData();


    console.log(
        "Customer data:",
        data
    );


    if (!validateCustomerData(data)) {

        return;

    }


    showLoading();


    try {

        const response =
            await fetch(
                `${API_URL}/predict`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(data)

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "API Error:",
                errorText
            );

            throw new Error(
                `API returned ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Prediction result:",
            result
        );


        // Save result

        localStorage.setItem(
            "churnPrediction",
            JSON.stringify(result)
        );


        // Save customer data

        localStorage.setItem(
            "customerData",
            JSON.stringify(data)
        );


        // Go to result page

        window.location.href =
            "result.html";


    }
    catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        hideLoading();


        alert(
            "Unable to connect to the AI server.\n\n" +
            "Make sure FastAPI is running at:\n" +
            API_URL
        );

    }

}


// ============================================================
// SHOW LOADING
// ============================================================

function showLoading() {

    const loading =
        document.getElementById(
            "loading"
        );


    const form =
        document.getElementById(
            "predictionForm"
        );


    if (loading) {

        loading.classList.remove(
            "hidden"
        );

    }


    if (form) {

        form.style.opacity = "0.4";

        form.style.pointerEvents =
            "none";

    }

}


// ============================================================
// HIDE LOADING
// ============================================================

function hideLoading() {

    const loading =
        document.getElementById(
            "loading"
        );


    const form =
        document.getElementById(
            "predictionForm"
        );


    if (loading) {

        loading.classList.add(
            "hidden"
        );

    }


    if (form) {

        form.style.opacity = "1";

        form.style.pointerEvents =
            "auto";

    }

}


// ============================================================
// DEMO CUSTOMER HELPER
// ============================================================

function setInput(id, value) {

    const input =
        document.getElementById(id);


    if (input) {

        input.value = value;

    }

}


// ============================================================
// LOW-RISK DEMO
// ============================================================

function loadLowRiskCustomer() {

    setInput("arpu_8", 300);

    setInput("offnet_mou_8", 100);

    setInput("loc_og_t2m_mou_7", 80);

    setInput("loc_og_t2m_mou_8", 85);

    setInput("loc_og_mou_7", 150);

    setInput("loc_og_mou_8", 155);

    setInput("total_og_mou_8", 220);

    setInput("loc_ic_t2m_mou_7", 70);

    setInput("loc_ic_t2m_mou_8", 75);

    setInput("loc_ic_mou_7", 120);

    setInput("loc_ic_mou_8", 125);

    setInput("total_ic_mou_7", 180);

    setInput("total_ic_mou_8", 190);

    setInput("total_rech_num_8", 15);

    setInput("total_rech_amt_8", 500);

    setInput("max_rech_amt_8", 100);

    setInput("last_day_rch_amt_8", 50);

    setInput("aon", 1500);

    setInput("tenure_years", 4.1);

    setInput("tenure_months", 49.3);

    setInput("min_arpu", 250);

    setInput("recent_arpu", 300);

    setInput("arpu_change", 10);

    setInput("avg_incoming_usage", 180);

    setInput("recent_incoming_usage", 190);

    setInput("incoming_usage_change", 10);

    setInput("recent_outgoing_usage", 220);

    setInput("outgoing_usage_change", 5);

    setInput("recent_offnet_usage", 100);

    setInput("activity_decline", 5);


    showDemoMessage(
        "Low-risk example loaded."
    );

}


// ============================================================
// HIGH-RISK DEMO
// ============================================================

function loadHighRiskCustomer() {

    setInput("arpu_8", 20);

    setInput("offnet_mou_8", 2);

    setInput("loc_og_t2m_mou_7", 3);

    setInput("loc_og_t2m_mou_8", 1);

    setInput("loc_og_mou_7", 5);

    setInput("loc_og_mou_8", 2);

    setInput("total_og_mou_8", 3);

    setInput("loc_ic_t2m_mou_7", 3);

    setInput("loc_ic_t2m_mou_8", 1);

    setInput("loc_ic_mou_7", 5);

    setInput("loc_ic_mou_8", 2);

    setInput("total_ic_mou_7", 5);

    setInput("total_ic_mou_8", 2);

    setInput("total_rech_num_8", 1);

    setInput("total_rech_amt_8", 10);

    setInput("max_rech_amt_8", 10);

    setInput("last_day_rch_amt_8", 0);

    setInput("aon", 100);

    setInput("tenure_years", 0.27);

    setInput("tenure_months", 3.3);

    setInput("min_arpu", 15);

    setInput("recent_arpu", 20);

    setInput("arpu_change", -50);

    setInput("avg_incoming_usage", 5);

    setInput("recent_incoming_usage", 2);

    setInput("incoming_usage_change", -10);

    setInput("recent_outgoing_usage", 3);

    setInput("outgoing_usage_change", -15);

    setInput("recent_offnet_usage", 2);

    setInput("activity_decline", 100);


    showDemoMessage(
        "High-risk example loaded."
    );

}


// ============================================================
// DEMO MESSAGE
// ============================================================

function showDemoMessage(message) {

    console.log(message);


    const demoBox =
        document.querySelector(
            ".demo-box"
        );


    if (!demoBox) {

        return;

    }


    let messageElement =
        document.getElementById(
            "demoMessage"
        );


    if (!messageElement) {

        messageElement =
            document.createElement(
                "div"
            );

        messageElement.id =
            "demoMessage";

        messageElement.className =
            "demo-message";

        demoBox.appendChild(
            messageElement
        );

    }


    messageElement.textContent =
        "✓ " + message;

}


// ============================================================
// LOAD RESULT PAGE
// ============================================================

function loadPredictionResult() {

    const resultTitle =
        document.getElementById(
            "resultTitle"
        );


    if (!resultTitle) {

        return;

    }


    const savedResult =
        localStorage.getItem(
            "churnPrediction"
        );


    if (!savedResult) {

        resultTitle.textContent =
            "No prediction found";


        const message =
            document.getElementById(
                "resultMessage"
            );


        if (message) {

            message.textContent =
                "Please make a prediction first.";

        }


        return;

    }


    try {

        const result =
            JSON.parse(
                savedResult
            );


        displayPredictionResult(
            result
        );


    }
    catch (error) {

        console.error(
            "Unable to load result:",
            error
        );

    }

}


// ============================================================
// DISPLAY RESULT
// ============================================================

function displayPredictionResult(result) {

    const prediction =
        Number(
            result.prediction
        );


    const probability =
        Number(
            result.probabvlity ??
            result.probability ??
            0
        );


    const percentage =
        (probability * 100)
        .toFixed(1);


    const resultTitle =
        document.getElementById(
            "resultTitle"
        );


    const resultProbability =
        document.getElementById(
            "resultProbability"
        );


    const resultMessage =
        document.getElementById(
            "resultMessage"
        );


    const riskLevel =
        document.getElementById(
            "riskLevel"
        );


    const riskBadge =
        document.getElementById(
            "riskBadge"
        );


    const resultIcon =
        document.getElementById(
            "resultIcon"
        );


    if (prediction === 1) {

        resultTitle.textContent =
            "Customer is likely to churn";

        resultMessage.textContent =
            "The model identifies this customer as being at risk of leaving the telecom service.";

        riskLevel.textContent =
            "HIGH RISK";

        riskBadge.textContent =
            "HIGH CHURN RISK";

        resultIcon.textContent =
            "⚠️";


        if (riskBadge) {

            riskBadge.classList.add(
                "high-risk"
            );

        }

    }
    else {

        resultTitle.textContent =
            "Customer is likely to stay";

        resultMessage.textContent =
            "The model identifies this customer as having a lower likelihood of churn.";

        riskLevel.textContent =
            "LOW RISK";

        riskBadge.textContent =
            "LOW CHURN RISK";

        resultIcon.textContent =
            "✓";


        if (riskBadge) {

            riskBadge.classList.add(
                "low-risk"
            );

        }

    }


    resultProbability.textContent =
        `${percentage}%`;


    animateProbability(
        probability
    );

}


// ============================================================
// PROBABILITY ANIMATION
// ============================================================

function animateProbability(target) {

    const element =
        document.getElementById(
            "resultProbability"
        );


    if (!element) {

        return;

    }


    const targetPercentage =
        target * 100;


    let current = 0;


    const duration = 1000;

    const steps = 60;

    const increment =
        targetPercentage / steps;


    const interval =
        duration / steps;


    const timer =
        setInterval(() => {

            current += increment;


            if (
                current >=
                targetPercentage
            ) {

                current =
                    targetPercentage;

                clearInterval(
                    timer
                );

            }


            element.textContent =
                `${current.toFixed(1)}%`;


        }, interval);

}


// ============================================================
// CLEAR OLD RESULT
// ============================================================

function clearPrediction() {

    localStorage.removeItem(
        "churnPrediction"
    );

    localStorage.removeItem(
        "customerData"
    );

}


// ============================================================
// EXPORT FUNCTIONS
// ============================================================

window.loadLowRiskCustomer =
    loadLowRiskCustomer;

window.loadHighRiskCustomer =
    loadHighRiskCustomer;

window.clearPrediction =
    clearPrediction;