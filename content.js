(function() {
    "use strict";
    console.log("Amazon Scraper content script loaded.");

    /********************************************************************
     * 1. GLOBAL STATE
     ********************************************************************/
    let scraperState = "idle";
    let asinQueue = [];
    let progressData = {};
    let scrapedReviewData = {}; // { asin: { allReviews: [ {body, ...}, ... ] } }

    // Carousel state: current ASIN index and current review index within that ASIN
    let currentAsinIndex = 0;
    let currentReviewIndex = 0;

    // We'll no longer use a fixed sampleReviews array—instead, use reviews collected for each ASIN.
    // For fallback during development, you can uncomment the line below:
    // const sampleReviews = [ "Review 1", "Review 2", "Review 3", "Review 4", "Review 5" ];

    // Chart data (for the carousel comparison chart)
    const chartData = {
        labels: [], // e.g., ["Review 1", "Review 2", ...]
        datasets: [
            {
                label: 'BERT Confidence',
                data: [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.2)',
                tension: 0.4
            },
            {
                label: 'Logistic Regression Confidence',
                data: [],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.2)',
                tension: 0.4
            }
        ]
    };

    /********************************************************************
     * 2. STYLES & UTILS
     ********************************************************************/
    const floatingContainerStyles = {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "999999",
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        padding: "18px",
        borderRadius: "12px",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        width: "280px"
    };

    const titleStyles = {
        fontWeight: "600",
        marginBottom: "12px",
        fontSize: "1.1rem",
        color: "#111827",
        borderBottom: "1px solid #f3f4f6",
        paddingBottom: "6px"
    };

    const statusStyles = {
        marginBottom: "10px",
        fontSize: "0.95rem",
        color: "#374151"
    };

    const progressStyles = {
        marginBottom: "12px",
        fontSize: "0.9rem",
        color: "#4b5563",
        maxHeight: "200px",
        overflowY: "auto"
    };

    const buttonBaseStyle = {
        padding: "8px 14px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: "500",
        marginRight: "6px",
        marginBottom: "6px"
    };

    const startButtonStyle = { backgroundColor: "#10b981", color: "#fff" };
    const pauseButtonStyle = { backgroundColor: "#f59e0b", color: "#fff" };
    const stopButtonStyle  = { backgroundColor: "#ef4444", color: "#fff" };
    const analyzeButtonStyle = { backgroundColor: "#6366f1", color: "#fff" };

    function makeDraggable(element) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        element.style.cursor = "grab";
        element.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            element.style.cursor = "grabbing";
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
        });
        function mouseMove(e) {
            if (isDragging) {
                element.style.left = (e.clientX - offsetX) + "px";
                element.style.top = (e.clientY - offsetY) + "px";
            }
        }
        function mouseUp() {
            isDragging = false;
            element.style.cursor = "grab";
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
        }
    }

    /********************************************************************
     * 3. SERVER COMMUNICATION FUNCTIONS
     ********************************************************************/
    async function sendReviewsToServer(asin, allReviews, criticalReviews, productDetailsHtml, reviewHtml, aodMainProductDetailsHtml, aodSellerInfoHtml) {
        const url = "http://localhost:3000/save-reviews";
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                asin, allReviews, criticalReviews,
                productDetailsHtml, reviewHtml,
                aodMainProductDetailsHtml, aodSellerInfoHtml
            })
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        console.log(`Server response for ASIN ${asin}:`, data);
    }

    async function analyzeSingleReview(text) {
        const url = "http://localhost:3000/analyze-review";
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error(`Analyze error: ${res.status}`);
        const analysis = await res.json();
        updateAnalysisUI(analysis);
        return analysis;
    }

    async function analyzeSentiment(reviewsTextArray) {
        const url = "http://localhost:3000/batch-evaluate";
        const samples = reviewsTextArray.map(text => ({ text, label: 1 }));
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ samples })
        });
        if (!res.ok) throw new Error(`Batch evaluation error: ${res.status}`);
        const result = await res.json();
        return result;
    }

    function updateAnalysisUI(analysis) {
        const bertLabelEl = document.getElementById("bertLabel");
        const bertConfidenceEl = document.getElementById("bertConfidence");
        const lrLabelEl = document.getElementById("lrLabel");
        const lrConfidenceEl = document.getElementById("lrConfidence");
        if (analysis && analysis.bert && analysis.lr) {
            bertLabelEl.textContent = `Prediction: ${analysis.bert.label} (${analysis.bert.confidence.toFixed(1)}%)`;
            bertConfidenceEl.style.width = analysis.bert.confidence + "%";
            lrLabelEl.textContent = `Prediction: ${analysis.lr.label} (${analysis.lr.confidence.toFixed(1)}%)`;
            lrConfidenceEl.style.width = analysis.lr.confidence + "%";
        } else {
            bertLabelEl.textContent = "Prediction: N/A";
            lrLabelEl.textContent = "Prediction: N/A";
        }
    }

    /********************************************************************
     * 4. UI CREATION
     ********************************************************************/
    // --- Scraper Control UI ---
    const controlContainer = document.createElement("div");
    Object.assign(controlContainer.style, floatingContainerStyles);
    controlContainer.id = "amazonScraperFloatingUI";

    const controlTitle = document.createElement("div");
    controlTitle.textContent = "Amazon Scraper Control";
    Object.assign(controlTitle.style, titleStyles);
    controlContainer.appendChild(controlTitle);

    const statusDisplay = document.createElement("div");
    statusDisplay.textContent = "Status: idle";
    Object.assign(statusDisplay.style, statusStyles);
    controlContainer.appendChild(statusDisplay);

    const progressDisplay = document.createElement("div");
    Object.assign(progressDisplay.style, progressStyles);
    progressDisplay.innerHTML = "Progress: N/A";
    controlContainer.appendChild(progressDisplay);

    const startBtn = document.createElement("button");
    startBtn.innerText = "Start Scraping";
    Object.assign(startBtn.style, buttonBaseStyle, startButtonStyle);

    const pauseBtn = document.createElement("button");
    pauseBtn.innerText = "Pause Scraping";
    Object.assign(pauseBtn.style, buttonBaseStyle, pauseButtonStyle);

    const stopBtn = document.createElement("button");
    stopBtn.innerText = "Stop Scraping";
    Object.assign(stopBtn.style, buttonBaseStyle, stopButtonStyle);

    const analyzeReviewsBtn = document.createElement("button");
    analyzeReviewsBtn.innerText = "Analyze Reviews (Current ASIN)";
    Object.assign(analyzeReviewsBtn.style, buttonBaseStyle, analyzeButtonStyle);
    analyzeReviewsBtn.disabled = true;

    const analyzeAllBtn = document.createElement("button");
    analyzeAllBtn.innerText = "Analyze All Reviews";
    Object.assign(analyzeAllBtn.style, buttonBaseStyle, analyzeButtonStyle);

    const analyzeCriticalBtn = document.createElement("button");
    analyzeCriticalBtn.innerText = "Analyze Critical";
    Object.assign(analyzeCriticalBtn.style, buttonBaseStyle, analyzeButtonStyle);
    analyzeCriticalBtn.disabled = true;

    controlContainer.appendChild(startBtn);
    controlContainer.appendChild(pauseBtn);
    controlContainer.appendChild(stopBtn);
    controlContainer.appendChild(analyzeReviewsBtn);
    controlContainer.appendChild(analyzeCriticalBtn);
    controlContainer.appendChild(analyzeAllBtn);
    document.body.appendChild(controlContainer);
    makeDraggable(controlContainer);

    // --- Analysis UI (Single Review) ---
    const analysisContainer = document.createElement("div");
    analysisContainer.id = "analysisContainer";
    Object.assign(analysisContainer.style, {
        position: "fixed",
        bottom: "20px",
        left: "20px",
        width: "350px",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        overflow: "hidden",
        zIndex: "1000",
        fontFamily: "'Inter', sans-serif"
    });
    analysisContainer.innerHTML = `
      <div style="padding:14px; background:#4f46e5; color:#fff; font-weight:600; font-size:16px; cursor:move;">
        AI Comparative Analysis 🤖
      </div>
      <div style="padding:14px; overflow-y:auto; max-height:480px;">
        <div style="background:#f9fafb; border-radius:8px; padding:10px; margin-bottom:10px;">
          <div><strong>Transformer (BERT)</strong></div>
          <div id="bertLabel">Prediction: N/A</div>
          <div style="width:100%; height:6px; background:#e5e7eb; border-radius:3px; margin-top:4px; overflow:hidden;">
            <div id="bertConfidence" style="height:100%; width:0%; background:#10b981;"></div>
          </div>
        </div>
        <div style="background:#f9fafb; border-radius:8px; padding:10px; margin-bottom:10px;">
          <div><strong>Logistic Regression</strong></div>
          <div id="lrLabel">Prediction: N/A</div>
          <div style="width:100%; height:6px; background:#e5e7eb; border-radius:3px; margin-top:4px; overflow:hidden;">
            <div id="lrConfidence" style="height:100%; width:0%; background:#ef4444;"></div>
          </div>
        </div>
        <div style="margin-top:10px;">
          <input id="analysisInput" type="text" placeholder="Enter review text" style="width:100%; padding:8px; margin-bottom:8px; border:1px solid #ccc; border-radius:4px;">
          <button id="analyzeBtn" style="width:100%; padding:8px; background:#6366f1; color:#fff; border:none; border-radius:6px; cursor:pointer;">Analyze Review</button>
        </div>
      </div>
    `;
    document.body.appendChild(analysisContainer);
    makeDraggable(analysisContainer);

    // --- Confusion Matrix Widget ---
    const matrixContainer = document.createElement("div");
    matrixContainer.id = "matrixContainer";
    Object.assign(matrixContainer.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "400px",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        padding: "20px",
        cursor: "move",
        zIndex: "1000",
        fontFamily: "'Inter', sans-serif"
    });
    matrixContainer.innerHTML = `
      <div style="background:#6366f1; color:#fff; padding:12px; border-radius:8px; font-weight:600; text-align:center; margin-bottom:16px;">
        Confusion Matrix 🔢
      </div>
      <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px;">
        <div style="background:#f9fafb; border-radius:8px; padding:12px; text-align:center;">
          <div style="color:#6b7280; font-size:13px;">True Positive</div>
          <div id="tp" style="color:#374151; font-size:20px; font-weight:bold;">-</div>
        </div>
        <div style="background:#f9fafb; border-radius:8px; padding:12px; text-align:center;">
          <div style="color:#6b7280; font-size:13px;">False Positive</div>
          <div id="fp" style="color:#374151; font-size:20px; font-weight:bold;">-</div>
        </div>
        <div style="background:#f9fafb; border-radius:8px; padding:12px; text-align:center;">
          <div style="color:#6b7280; font-size:13px;">False Negative</div>
          <div id="fn" style="color:#374151; font-size:20px; font-weight:bold;">-</div>
        </div>
        <div style="background:#f9fafb; border-radius:8px; padding:12px; text-align:center;">
          <div style="color:#6b7280; font-size:13px;">True Negative</div>
          <div id="tn" style="color:#374151; font-size:20px; font-weight:bold;">-</div>
        </div>
      </div>
    `;
    document.body.appendChild(matrixContainer);
    makeDraggable(matrixContainer);

    // --- Carousel / Comparison Chart UI ---
    const carouselContainer = document.createElement("div");
    carouselContainer.id = "carouselContainer";
    Object.assign(carouselContainer.style, {
        position: "fixed",
        bottom: "290px",
        left: "20px",
        width: "650px",
        height: "320px",
        background: "#ffffff",
        borderRadius: "14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        overflow: "hidden",
        zIndex: "999"
    });
    carouselContainer.innerHTML = `
      <div id="reviewText" style="height:70px; display:flex; align-items:center; justify-content:center; font-size:14px; color:#374151; margin-bottom:10px; cursor:move;">
        <!-- Placeholder; will be updated with collected reviews -->
      </div>
      <canvas id="comparisonChart" style="max-height:180px;"></canvas>
      <div style="display:flex; justify-content:space-between; padding:0 12px 12px;">
        <button id="prevReviewBtn">← Prev</button>
        <button id="nextReviewBtn">Next →</button>
      </div>
    `;
    document.body.appendChild(carouselContainer);
    makeDraggable(carouselContainer);

    // Initialize Chart.js chart
    const ctx = document.getElementById("comparisonChart").getContext("2d");
    const comparisonChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { suggestedMin: 0, suggestedMax: 100 } }
        }
    });

    /********************************************************************
     * 5. EVENT LISTENER ATTACHMENTS
     ********************************************************************/
    startBtn.addEventListener("click", handleStartButtonClick);
    pauseBtn.addEventListener("click", handlePauseButtonClick);
    stopBtn.addEventListener("click", handleStopButtonClick);
    analyzeReviewsBtn.addEventListener("click", handleBatchAnalyze); // Batch for current ASIN
    analyzeCriticalBtn.addEventListener("click", () => handleAnalyzeButtonClick("critical"));
    analyzeAllBtn.addEventListener("click", handleAnalyzeAll);
    document.getElementById("analyzeBtn").addEventListener("click", () => {
        const text = document.getElementById("analysisInput").value.trim();
        if (!text) {
            alert("Please enter a review text to analyze.");
            return;
        }
        analyzeSingleReview(text)
            .then(analysis => updateAnalysisUI(analysis))
            .catch(err => console.error(err));
    });
    document.getElementById("prevReviewBtn").addEventListener("click", prevReview);
    document.getElementById("nextReviewBtn").addEventListener("click", nextReview);

    /********************************************************************
     * 6. SINGLE & BATCH ANALYSIS FUNCTIONS
     ********************************************************************/
    async function analyzeSingleReview(text) {
        const url = "http://localhost:3000/analyze-review";
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error(`Analyze error: ${res.status}`);
        const analysis = await res.json();
        updateAnalysisUI(analysis);
        return analysis;
    }

    async function analyzeSentiment(reviewsTextArray) {
        const url = "http://localhost:3000/batch-evaluate";
        const samples = reviewsTextArray.map(text => ({ text, label: 1 }));
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ samples })
        });
        if (!res.ok) throw new Error(`Batch evaluation error: ${res.status}`);
        const result = await res.json();
        return result;
    }

    function updateAnalysisUI(analysis) {
        const bertLabelEl = document.getElementById("bertLabel");
        const bertConfidenceEl = document.getElementById("bertConfidence");
        const lrLabelEl = document.getElementById("lrLabel");
        const lrConfidenceEl = document.getElementById("lrConfidence");
        if (analysis && analysis.bert && analysis.lr) {
            bertLabelEl.textContent = `Prediction: ${analysis.bert.label} (${analysis.bert.confidence.toFixed(1)}%)`;
            bertConfidenceEl.style.width = analysis.bert.confidence + "%";
            lrLabelEl.textContent = `Prediction: ${analysis.lr.label} (${analysis.lr.confidence.toFixed(1)}%)`;
            lrConfidenceEl.style.width = analysis.lr.confidence + "%";
        } else {
            bertLabelEl.textContent = "Prediction: N/A";
            lrLabelEl.textContent = "Prediction: N/A";
        }
    }

    async function handleBatchAnalyze() {
        // Batch analyze reviews for the current ASIN
        if (asinQueue.length === 0) {
            alert("No ASINs available.");
            return;
        }
        const currentAsin = asinQueue[currentAsinIndex];
        const asinData = scrapedReviewData[currentAsin];
        if (!asinData || !asinData.allReviews || asinData.allReviews.length === 0) {
            alert("No reviews available for the current ASIN.");
            return;
        }
        const reviewsArray = asinData.allReviews.map(r => r.body).filter(Boolean);
        try {
            const result = await analyzeSentiment(reviewsArray);
            console.log("Batch evaluation result:", result);
            if (result.metrics_bert && result.metrics_bert.confusion_matrix) {
                const cm = result.metrics_bert.confusion_matrix;
                updateConfusionMatrix(cm[1][1], cm[0][1], cm[1][0], cm[0][0]);
            }
        } catch (error) {
            console.error("Error during batch analysis:", error);
            alert("Failed batch analysis.");
        }
    }

    async function handleAnalyzeAll() {
        // Batch analyze all reviews across all ASINs.
        let allReviews = [];
        Object.values(scrapedReviewData).forEach(obj => {
            if (obj.allReviews && obj.allReviews.length > 0) {
                allReviews = allReviews.concat(obj.allReviews.map(r => r.body).filter(Boolean));
            }
        });
        if (allReviews.length === 0) {
            alert("No reviews available for analysis.");
            return;
        }
        try {
            const result = await analyzeSentiment(allReviews);
            console.log("Batch evaluation (all) result:", result);
            if (result.metrics_bert && result.metrics_bert.confusion_matrix) {
                const cm = result.metrics_bert.confusion_matrix;
                updateConfusionMatrix(cm[1][1], cm[0][1], cm[1][0], cm[0][0]);
            }
        } catch (error) {
            console.error("Error during analyze all:", error);
            alert("Failed batch analysis for all reviews.");
        }
    }

    function handleAnalyzeButtonClick(reviewType) {
        alert(`Placeholder: analyzing ${reviewType} reviews...`);
    }

    /********************************************************************
     * 16. CAROUSEL & CHART UPDATE FUNCTIONS
     ********************************************************************/
    // Update the carousel using reviews from scrapedReviewData for the current ASIN.
    function updateCarouselForCurrentReview(analysis) {
        const reviewTextEl = document.getElementById("reviewText");
        const currentAsin = asinQueue[currentAsinIndex];
        const asinData = scrapedReviewData[currentAsin];
        if (!asinData || !asinData.allReviews || asinData.allReviews.length === 0) {
            reviewTextEl.textContent = "No reviews for current ASIN.";
            return;
        }
        const review = asinData.allReviews[currentReviewIndex];
        reviewTextEl.textContent = review ? `"${review.body}"` : "No review text available.";

        const reviewLabel = `Review ${currentReviewIndex + 1}`;
        if (currentReviewIndex === chartData.labels.length) {
            chartData.labels.push(reviewLabel);
            chartData.datasets[0].data.push(analysis.bert.confidence);
            chartData.datasets[1].data.push(analysis.lr.confidence);
        } else {
            chartData.labels[currentReviewIndex] = reviewLabel;
            chartData.datasets[0].data[currentReviewIndex] = analysis.bert.confidence;
            chartData.datasets[1].data[currentReviewIndex] = analysis.lr.confidence;
            while (chartData.labels.length > currentReviewIndex + 1) {
                chartData.labels.pop();
                chartData.datasets[0].data.pop();
                chartData.datasets[1].data.pop();
            }
        }
        comparisonChart.update();
    }

    async function nextReview() {
        if (asinQueue.length === 0) return;
        const currentAsin = asinQueue[currentAsinIndex];
        const asinData = scrapedReviewData[currentAsin];
        if (!asinData || !asinData.allReviews || asinData.allReviews.length === 0) {
            alert("No reviews for current ASIN.");
            return;
        }
        if (currentReviewIndex < asinData.allReviews.length - 1) {
            currentReviewIndex++;
        } else {
            if (currentAsinIndex < asinQueue.length - 1) {
                currentAsinIndex++;
                currentReviewIndex = 0;
            } else {
                alert("No more reviews available.");
                return;
            }
        }
        try {
            const analysis = await analyzeSingleReview(asinData.allReviews[currentReviewIndex].body);
            updateCarouselForCurrentReview(analysis);
        } catch (err) {
            console.error(err);
        }
    }

    async function prevReview() {
        if (asinQueue.length === 0) return;
        const currentAsin = asinQueue[currentAsinIndex];
        const asinData = scrapedReviewData[currentAsin];
        if (!asinData || !asinData.allReviews || asinData.allReviews.length === 0) {
            alert("No reviews for current ASIN.");
            return;
        }
        if (currentReviewIndex > 0) {
            currentReviewIndex--;
        } else {
            if (currentAsinIndex > 0) {
                currentAsinIndex--;
                const prevAsinData = scrapedReviewData[asinQueue[currentAsinIndex]];
                currentReviewIndex = (prevAsinData && prevAsinData.allReviews && prevAsinData.allReviews.length > 0) ? prevAsinData.allReviews.length - 1 : 0;
            } else {
                alert("Already at the first review of the first ASIN.");
                return;
            }
        }
        try {
            const analysis = await analyzeSingleReview(asinData.allReviews[currentReviewIndex].body);
            updateCarouselForCurrentReview(analysis);
        } catch (err) {
            console.error(err);
        }
    }

    document.getElementById("prevReviewBtn").addEventListener("click", prevReview);
    document.getElementById("nextReviewBtn").addEventListener("click", nextReview);

    /********************************************************************
     * 17. SCRAPER LOOP & PROGRESS UPDATE
     ********************************************************************/
    async function runScraperLoop() {
        if (scraperState !== "running") {
            scraperState = "running";
            statusDisplay.textContent = "Status: running";
        }
        const tasks = asinQueue.map(asin => scrapeAsin(asin));
        await Promise.all(tasks);
        if (scraperState === "running") {
            scraperState = "idle";
            statusDisplay.textContent = "Status: idle (queue processed)";
            progressDisplay.innerHTML = "All ASINs processed. Scraping complete.";
            analyzeReviewsBtn.disabled = false;
            analyzeCriticalBtn.disabled = false;
        }
    }

    async function scrapeAsin(asin) {
        if (scraperState !== "running") return;
        updateProgressForAsin(asin, "scraping-details");
        let productDetailsHtml;
        try {
            productDetailsHtml = await fetchProductDetailsPage(asin);
            updateProgressForAsin(asin, "detailsDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "detailsError", error.message);
            return;
        }
        if (scraperState !== "running") return;
        updateProgressForAsin(asin, "scraping-aod-main");
        let aodMainProductDetailsHtml;
        try {
            aodMainProductDetailsHtml = await fetchAodMainProductDetailsPage(asin);
            updateProgressForAsin(asin, "aodMainDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "aodMainError", error.message);
            return;
        }
        if (scraperState !== "running") return;
        updateProgressForAsin(asin, "scraping-aod-sellers");
        let aodSellerInfoHtml;
        try {
            aodSellerInfoHtml = await fetchAodSellerInfoPage(asin);
            updateProgressForAsin(asin, "aodSellerDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "aodSellerError", error.message);
            return;
        }
        if (scraperState !== "running") return;
        updateProgressForAsin(asin, "scraping-all-reviews");
        let allReviewsData;
        try {
            allReviewsData = await fetchReviewPage(asin, "all");
            updateProgressForAsin(asin, "allReviewsDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "allReviewsError", error.message);
            return;
        }
        if (scraperState !== "running") return;
        updateProgressForAsin(asin, "scraping-critical-reviews");
        let criticalReviewsData;
        try {
            criticalReviewsData = await fetchReviewPage(asin, "critical");
            updateProgressForAsin(asin, "criticalReviewsDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "criticalReviewsError", error.message);
            return;
        }
        if (scraperState !== "running") return;
        updateProgressForAsin(asin, "sending-to-server");
        try {
            await sendReviewsToServer(
                asin,
                allReviewsData.accumulatedReviews,
                criticalReviewsData.accumulatedReviews,
                productDetailsHtml,
                allReviewsData.reviewHtml,
                aodMainProductDetailsHtml,
                aodSellerInfoHtml
            );
            updateProgressForAsin(asin, "done", true);
            scrapedReviewData[asin] = {
                allReviews: allReviewsData.accumulatedReviews,
                criticalReviews: criticalReviewsData.accumulatedReviews
            };
        } catch (error) {
            updateProgressForAsin(asin, "serverError", error.message);
        }
    }

    function updateOverallProgressUI() {
        let completedCount = 0, errorCount = 0, analysisCount = 0;
        Object.keys(progressData).forEach(asin => {
            if (progressData[asin].done) completedCount++;
            else if (progressData[asin].detailsError || progressData[asin].serverError) errorCount++;
            if (progressData[asin].analysisAllDone || progressData[asin].analysisCriticalDone) analysisCount++;
        });
        progressDisplay.innerHTML = `
        <p>Status: ${scraperState}</p>
        <p>Scraped: ${completedCount} / ${asinQueue.length}</p>
        <p>Analyzed: ${analysisCount} / ${asinQueue.length}</p>
        <p>Errors: ${errorCount}</p>
      `;
    }

    function updateProgressForAsin(asin, step, value = null) {
        if (!progressData[asin]) progressData[asin] = {};
        progressData[asin][step] = (value === null ? true : value);
        updateOverallProgressUI();
    }

    /********************************************************************
     * 18. EVENT LISTENER ATTACHMENTS
     ********************************************************************/
    startBtn.addEventListener("click", handleStartButtonClick);
    pauseBtn.addEventListener("click", handlePauseButtonClick);
    stopBtn.addEventListener("click", handleStopButtonClick);
    analyzeReviewsBtn.addEventListener("click", handleBatchAnalyze);
    analyzeCriticalBtn.addEventListener("click", () => handleAnalyzeButtonClick("critical"));
    analyzeAllBtn.addEventListener("click", handleAnalyzeAll);
    document.getElementById("analyzeBtn").addEventListener("click", () => {
        const text = document.getElementById("analysisInput").value.trim();
        if (!text) {
            alert("Please enter a review text to analyze.");
            return;
        }
        analyzeSingleReview(text)
            .then(analysis => updateAnalysisUI(analysis))
            .catch(err => console.error(err));
    });
    document.getElementById("prevReviewBtn").addEventListener("click", prevReview);
    document.getElementById("nextReviewBtn").addEventListener("click", nextReview);

    /********************************************************************
     * 15. SCRAPER CONTROL HANDLERS
     ********************************************************************/
    async function handleStartButtonClick() {
        if (scraperState === "running") return;
        if (scraperState === "paused") {
            scraperState = "running";
            statusDisplay.textContent = "Status: running (resumed)";
            runScraperLoop();
        } else {
            scraperState = "running";
            statusDisplay.textContent = "Status: running";
            asinQueue = [];
            progressData = {};
            scrapedReviewData = {};
            const extractedAsins = extractAsins();
            if (extractedAsins.length === 0) {
                scraperState = "idle";
                statusDisplay.textContent = "Status: idle (no ASINs found)";
                progressDisplay.innerHTML = "No ASINs found on the page.";
                return;
            }
            asinQueue = extractedAsins;
            console.log("ASINs found:", asinQueue);
            asinQueue.forEach(asin => { progressData[asin] = { step: "pending" }; });
            updateOverallProgressUI();
            analyzeReviewsBtn.disabled = true;
            analyzeCriticalBtn.disabled = true;
            try {
                const resp = await fetch("http://localhost:3000/start-scrape", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ asins: asinQueue })
                });
                if (!resp.ok) {
                    const msg = `Failed to start. Status: ${resp.status}`;
                    statusDisplay.textContent = `Status: Error - ${msg}`;
                    scraperState = "idle";
                    throw new Error(msg);
                }
                const data = await resp.json();
                console.log("Scrape started:", data);
                runScraperLoop();
            } catch (error) {
                console.error("Error starting scrape:", error);
                statusDisplay.textContent = `Status: Error - ${error.message}`;
                scraperState = "idle";
            }
        }
    }

    function handlePauseButtonClick() {
        if (scraperState === "running") {
            scraperState = "paused";
            statusDisplay.textContent = "Status: paused";
        }
    }

    function handleStopButtonClick() {
        scraperState = "stopped";
        statusDisplay.textContent = "Status: stopped";
        analyzeReviewsBtn.disabled = false;
        analyzeCriticalBtn.disabled = false;
        console.log("Stopped scraping.");
    }

    /********************************************************************
     * 9. UTILITY FUNCTIONS - Functional Logic
     ********************************************************************/
    // A simple wait function for “pausing” loops (not used in this version but kept for potential future use)
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchProductDetailsPage(asin) {
        const productDetailsUrl = `https://www.amazon.com/dp/${asin}/`;
        console.log(`[DEBUG] Fetching product details page: ${productDetailsUrl}`);

        try {
            const response = await fetch(productDetailsUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${productDetailsUrl}`);
            }
            const productDetailsHtml = await response.text();
            return productDetailsHtml;
        } catch (error) {
            console.error(`[DEBUG] Error fetching product details for ASIN ${asin}:`, error);
            throw error; // Re-throw to be caught in scrapeAsin
        }
    }

    async function fetchAodMainProductDetailsPage(asin) {
        const aodMainProductDetailsUrl = `https://www.amazon.com/gp/product/ajax/ref=dp_aod_ALL_mbc?asin=${asin}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&experienceId=aodAjaxMain`;
        console.log(`[DEBUG] Fetching AOD Main Product Details page: ${aodMainProductDetailsUrl}`);

        try {
            const response = await fetch(aodMainProductDetailsUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${aodMainProductDetailsUrl}`);
            }
            const aodMainProductDetailsHtml = await response.text();
            return aodMainProductDetailsHtml;
        } catch (error) {
            console.error(`[DEBUG] Error fetching AOD Main Product Details for ASIN ${asin}:`, error);
            throw error; // Re-throw
        }
    }

    async function fetchAodSellerInfoPage(asin, pageNumber = 1) {
        const aodSellerInfoUrl = `https://www.amazon.com/gp/product/ajax/ref=aod_page_${pageNumber}?asin=${asin}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&isonlyrenderofferlist=true&pageno=${pageNumber}&experienceId=aodAjaxMain`;
        console.log(`[DEBUG] Fetching AOD Seller Info page ${pageNumber}: ${aodSellerInfoUrl}`);

        try {
            const response = await fetch(aodSellerInfoUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${aodSellerInfoUrl}`);
            }
            const aodSellerInfoHtml = await response.text();
            return aodSellerInfoHtml;
        } catch (error) {
            console.error(`[DEBUG] Error fetching AOD Seller Info for ASIN ${asin} - p${pageNumber}:`, error);
            throw error; // Re-throw
        }
    }

    async function fetchReviewPage(asin, reviewType, pageUrl, accumulatedReviews) {
        const filterType = reviewType === "critical" ? "critical" : "all_reviews";
        if (!pageUrl) {
            pageUrl = `https://www.amazon.com/product-reviews/${asin}/ref=cm_cr_arp_d_paging_btm_next_1?ie=UTF8&reviewerType=all_reviews&filterByStar=${filterType}&pageNumber=1`;
        }
        if (!accumulatedReviews) {
            accumulatedReviews = [];
        }

        let currentPageNumber = 1;
        try {
            const urlParams = new URLSearchParams(new URL(pageUrl).search);
            const pageNumberParam = urlParams.get("pageNumber");
            if (pageNumberParam) {
                currentPageNumber = parseInt(pageNumberParam, 10);
            }
        } catch (error) {
            console.warn(`Could not parse pageNumber from URL: ${pageUrl}`, error);
        }

        console.log(`[DEBUG] START fetchReviewPage - ${reviewType} - Page ${currentPageNumber}`);

        try {
            const response = await fetch(pageUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for URL: ${pageUrl}`);
            }
            const reviewHtml = await response.text();
            const parsedReviews = parseReviewsFromHtmlFragment(reviewHtml);
            accumulatedReviews.push(...parsedReviews);

            console.log(
                `[DEBUG] Parsed ${parsedReviews.length} ${reviewType} reviews from page ${currentPageNumber}, total: ${accumulatedReviews.length}`
            );

            const nextPageLinkHref = findNextPageLinkHrefFromFragment(reviewHtml);
            if (nextPageLinkHref) {
                const nextPageUrl = new URL(nextPageLinkHref, pageUrl).href;
                return fetchReviewPage(asin, reviewType, nextPageUrl, accumulatedReviews);
            } else {
                console.log(
                    `[DEBUG] No more ${reviewType} review pages. Total: ${accumulatedReviews.length}`
                );
                return { accumulatedReviews: accumulatedReviews, reviewHtml };
            }
        } catch (error) {
            console.error(`[DEBUG] ERROR in fetchReviewPage - ${reviewType}`, error);
            throw error; // Re-throw
        } finally {
            console.log(`[DEBUG] END fetchReviewPage - ${reviewType} - Page ${currentPageNumber}`);
        }
    }

    /********************************************************************
     * 10. REVIEW PARSING - Functional Logic
     ********************************************************************/
    function parseReviewsFromHtmlFragment(htmlFragment) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlFragment, "text/html");
        let reviews = [];

        const reviewElements = doc.querySelectorAll(
            '#cm_cr-review_list [data-hook="review"]'
        );
        reviewElements.forEach(reviewElement => {
            const review = {};
            review.reviewerName =
                reviewElement.querySelector('[data-hook="review-author"]')?.textContent.trim() ??
                null;

            const ratingElement = reviewElement.querySelector('[data-hook="review-star-rating"]');
            if (ratingElement) {
                const ratingText = ratingElement.querySelector(".a-icon-alt").textContent.trim();
                const ratingMatch = ratingText.match(/(\d[,.]\d)/);
                review.rating = ratingMatch
                    ? parseFloat(ratingMatch[1].replace(",", "."))
                    : null;
            }
            review.title =
                reviewElement.querySelector('[data-hook="review-title"]')?.textContent.trim() ?? null;
            review.date =
                reviewElement.querySelector('[data-hook="review-date"]')?.textContent.trim() ?? null;
            review.body =
                reviewElement.querySelector('[data-hook="review-body"]')?.textContent.trim() ?? null;
            const helpfulVotesElement = reviewElement.querySelector('[data-hook="helpful-vote-statement"]');
            if (helpfulVotesElement) {
                const helpfulVotesText = helpfulVotesElement.textContent.trim();
                const helpfulVotesMatch = helpfulVotesText.match(/(\d+|One)/);
                review.helpfulVotes = helpfulVotesMatch
                    ? helpfulVotesMatch[1] === "One"
                        ? 1
                        : parseInt(helpfulVotesMatch[1], 10)
                    : null;
            }
            reviews.push(review);
        });
        return reviews;
    }

    function findNextPageLinkHrefFromFragment(htmlFragment) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlFragment, "text/html");
        const nextPageElement = doc.querySelector(".a-pagination .a-last:not(.a-disabled) a");
        return nextPageElement ? nextPageElement.getAttribute("href") : null;
    }

    /********************************************************************
     * 12. ASIN EXTRACTION FUNCTION - Functional Logic
     ********************************************************************/
    function extractAsins() {
        const asinElements = document.querySelectorAll('div[data-asin]');
        const asins = [];
        asinElements.forEach(el => {
            const asin = el.getAttribute('data-asin');
            if (asin) asins.push(asin);
        });
        return asins;
    }


    /********************************************************************
     * 19. CONFUSION MATRIX UPDATE FUNCTION
     ********************************************************************/
    function updateConfusionMatrix(tp, fp, fn, tn) {
        document.getElementById('tp').textContent = tp;
        document.getElementById('fp').textContent = fp;
        document.getElementById('fn').textContent = fn;
        document.getElementById('tn').textContent = tn;
    }


})();