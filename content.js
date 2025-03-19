(function() {
    console.log("Amazon Scraper content script loaded.");

    /********************************************************************
     * 1. GLOBAL STATE
     ********************************************************************/
    let scraperState = "idle";
    let asinQueue = [];
    let progressData = {}; // Progress tracked per ASIN
    let scrapedReviewData = {}; // Store scraped reviews for analysis

    // For analysis carousel (sample reviews for demonstration)
    let currentReviewIndex = 0;
    const sampleReviews = [
        "This product exceeded my expectations! Highly recommended.",
        "The delivery was slow, but I'm happy with the quality.",
        "Disappointed with the product, not as described.",
        "Great value for money, will buy again.",
        "Average performance, expected better."
    ];

    /********************************************************************
     * 2. STYLES - Reusable styles for UI elements
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
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        width: "280px",
        transition: "box-shadow 0.3s ease-in-out"
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
        color: "#374151",
    };

    const progressStyles = {
        marginBottom: "12px",
        fontSize: "0.9rem",
        color: "#4b5563",
        maxHeight: "200px",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#d1d5db #f9fafb"
    };

    // Buttons Base
    const buttonBaseStyle = {
        padding: "8px 14px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: "500",
        transition: "transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
        marginRight: "6px",
        marginBottom: "6px"
    };

    // Button Styles
    const startButtonStyle = { backgroundColor: "#10b981", color: "#fff" };
    const startButtonHoverStyle = { backgroundColor: "#059669", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(5,150,105,0.3)" };
    const pauseButtonStyle = { backgroundColor: "#f59e0b", color: "#fff" };
    const pauseButtonHoverStyle = { backgroundColor: "#d97706", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(217,119,6,0.3)" };
    const stopButtonStyle = { backgroundColor: "#ef4444", color: "#fff" };
    const stopButtonHoverStyle = { backgroundColor: "#dc2626", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(220,38,38,0.3)" };
    const analyzeButtonStyle = { backgroundColor: "#6366f1", color: "#fff" };
    const analyzeButtonHoverStyle = { backgroundColor: "#4f46e5", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(79,70,229,0.3)" };

    /********************************************************************
     * 3. DRAGGABLE FUNCTION - Make any element draggable
     ********************************************************************/
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
     * 4. OVERLAY / FLOATING UI - SCRAPER CONTROLS
     ********************************************************************/
    const floatingContainer = document.createElement("div");
    const scrollbarStyles = `
        #amazonScraperFloatingUI::-webkit-scrollbar { width: 6px; }
        #amazonScraperFloatingUI::-webkit-scrollbar-track { background: #f9fafb; border-radius: 6px; }
        #amazonScraperFloatingUI::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 6px; }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = scrollbarStyles;
    document.head.appendChild(styleEl);
    Object.assign(floatingContainer.style, floatingContainerStyles);
    floatingContainer.id = "amazonScraperFloatingUI";

    // Title for Scraper Control
    const titleEl = document.createElement("div");
    titleEl.textContent = "Amazon Scraper Control";
    Object.assign(titleEl.style, titleStyles);
    floatingContainer.appendChild(titleEl);

    // Status display
    const statusEl = document.createElement("div");
    statusEl.textContent = "Status: idle";
    Object.assign(statusEl.style, statusStyles);
    floatingContainer.appendChild(statusEl);

    // Progress display
    const progressEl = document.createElement("div");
    Object.assign(progressEl.style, progressStyles);
    progressEl.innerHTML = "Progress: N/A";
    floatingContainer.appendChild(progressEl);

    // Control Buttons
    const startBtn = document.createElement("button");
    startBtn.innerText = "Start Scraping";
    Object.assign(startBtn.style, buttonBaseStyle, startButtonStyle);
    startBtn.addEventListener("mouseover", () => Object.assign(startBtn.style, startButtonHoverStyle));
    startBtn.addEventListener("mouseout", () => Object.assign(startBtn.style, startButtonStyle));

    const pauseBtn = document.createElement("button");
    pauseBtn.innerText = "Pause Scraping";
    Object.assign(pauseBtn.style, buttonBaseStyle, pauseButtonStyle);
    pauseBtn.addEventListener("mouseover", () => Object.assign(pauseBtn.style, pauseButtonHoverStyle));
    pauseBtn.addEventListener("mouseout", () => Object.assign(pauseBtn.style, pauseButtonStyle));

    const stopBtn = document.createElement("button");
    stopBtn.innerText = "Stop Scraping";
    Object.assign(stopBtn.style, buttonBaseStyle, stopButtonStyle);
    stopBtn.addEventListener("mouseover", () => Object.assign(stopBtn.style, stopButtonHoverStyle));
    stopBtn.addEventListener("mouseout", () => Object.assign(stopBtn.style, stopButtonStyle));

    const analyzeReviewsBtn = document.createElement("button");
    analyzeReviewsBtn.innerText = "Analyze Reviews";
    Object.assign(analyzeReviewsBtn.style, buttonBaseStyle, analyzeButtonStyle);
    analyzeReviewsBtn.addEventListener("mouseover", () => Object.assign(analyzeReviewsBtn.style, analyzeButtonHoverStyle));
    analyzeReviewsBtn.addEventListener("mouseout", () => Object.assign(analyzeReviewsBtn.style, analyzeButtonStyle));
    analyzeReviewsBtn.disabled = true;

    const analyzeCriticalBtn = document.createElement("button");
    analyzeCriticalBtn.innerText = "Analyze Critical";
    Object.assign(analyzeCriticalBtn.style, buttonBaseStyle, analyzeButtonStyle);
    analyzeCriticalBtn.addEventListener("mouseover", () => Object.assign(analyzeCriticalBtn.style, analyzeButtonHoverStyle));
    analyzeCriticalBtn.addEventListener("mouseout", () => Object.assign(analyzeCriticalBtn.style, analyzeButtonStyle));
    analyzeCriticalBtn.disabled = true;

    floatingContainer.appendChild(startBtn);
    floatingContainer.appendChild(pauseBtn);
    floatingContainer.appendChild(stopBtn);
    floatingContainer.appendChild(analyzeReviewsBtn);
    floatingContainer.appendChild(analyzeCriticalBtn);
    document.body.appendChild(floatingContainer);
    makeDraggable(floatingContainer);

    /********************************************************************
     * 4A. ANALYSIS UI - Floating Container for AI Comparative Analysis
     ********************************************************************/
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
      <div class="header" style="padding:14px; background:#4f46e5; color:#fff; font-weight:600; font-size:16px; display:flex; justify-content:space-between; align-items:center; cursor:move;">
          AI Comparative Analysis 🤖
      </div>
      <div class="body" style="padding:14px; overflow-y:auto; max-height:480px;">
          <div class="model" style="background:#f9fafb; border-radius:8px; padding:10px; margin-bottom:10px;">
              <div><strong>Transformer (BERT)</strong></div>
              <div id="bertLabel">Prediction: N/A</div>
              <div class="confidence-bar" style="width:100%; height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden; margin-top:4px;">
                  <div id="bertConfidence" class="confidence-fill" style="height:100%; width:0%; background:#10b981;"></div>
              </div>
          </div>
          <div class="model" style="background:#f9fafb; border-radius:8px; padding:10px; margin-bottom:10px;">
              <div><strong>Logistic Regression</strong></div>
              <div id="lrLabel">Prediction: N/A</div>
              <div class="confidence-bar" style="width:100%; height:6px; background:#e5e7eb; border-radius:3px; overflow:hidden; margin-top:4px;">
                  <div id="lrConfidence" class="confidence-fill" style="height:100%; width:0%; background:#ef4444;"></div>
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

    /********************************************************************
     * 4B. CONFUSION MATRIX WIDGET (Draggable)
     ********************************************************************/
    const confusionMatrixContainer = document.createElement("div");
    confusionMatrixContainer.id = "dragMatrix";
    Object.assign(confusionMatrixContainer.style, {
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        padding: "20px",
        width: "400px",
        position: "fixed",
        top: "20px",
        right: "20px",
        cursor: "move",
        zIndex: "1000",
        fontFamily: "'Inter', sans-serif"
    });
    confusionMatrixContainer.innerHTML = `
      <div class="matrix-header" style="background:#6366f1; color:#fff; padding:12px; border-radius:8px; font-weight:600; text-align:center; margin-bottom:16px;">
         Confusion Matrix 🔢
      </div>
      <div class="matrix-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px;">
         <div class="matrix-cell" style="background:#f9fafb; border-radius:8px; padding:12px; text-align:center;">
             <div class="cell-title" style="color:#6b7280; font-size:13px;">True Positive</div>
             <div class="cell-value" id="tp" style="color:#374151; font-size:20px; font-weight:bold;">-</div>
         </div>
         <div class="matrix-cell" style="background:#f9fafb; border-radius:8px; padding:12px; text-align:center;">
             <div class="cell-title" style="color:#6b7280; font-size:13px;">False Positive</div>
             <div class="cell-value" id="fp" style="color:#374151; font-size:20px; font-weight:bold;">-</div>
         </div>
         <div class="matrix-cell" style="background:#f9fafb; border-radius:8px; padding:12px; text-align:center;">
             <div class="cell-title" style="color:#6b7280; font-size:13px;">False Negative</div>
             <div class="cell-value" id="fn" style="color:#374151; font-size:20px; font-weight:bold;">-</div>
         </div>
         <div class="matrix-cell" style="background:#f9fafb; border-radius:8px; padding:12px; text-align:center;">
             <div class="cell-title" style="color:#6b7280; font-size:13px;">True Negative</div>
             <div class="cell-value" id="tn" style="color:#374151; font-size:20px; font-weight:bold;">-</div>
         </div>
      </div>
    `;
    document.body.appendChild(confusionMatrixContainer);
    makeDraggable(confusionMatrixContainer);

    // Function to update confusion matrix values
    function updateConfusionMatrix(tp, fp, fn, tn) {
        document.getElementById("tp").textContent = tp;
        document.getElementById("fp").textContent = fp;
        document.getElementById("fn").textContent = fn;
        document.getElementById("tn").textContent = tn;
    }

    /********************************************************************
     * 5. EVENT LISTENERS FOR SCRAPER BUTTONS & ANALYSIS
     ********************************************************************/
    startBtn.addEventListener("click", handleStartButtonClick);
    pauseBtn.addEventListener("click", handlePauseButtonClick);
    stopBtn.addEventListener("click", handleStopButtonClick);
    analyzeReviewsBtn.addEventListener("click", () => handleAnalyzeButtonClick("all"));
    analyzeCriticalBtn.addEventListener("click", () => handleAnalyzeButtonClick("critical"));
    document.getElementById("analyzeBtn").addEventListener("click", () => {
        const text = document.getElementById("analysisInput").value;
        if (text.trim() === "") {
            alert("Please enter a review text to analyze.");
            return;
        }
        analyzeSingleReview(text);
    });
    // Ensure carousel control elements exist in your page; if not, create them.
    // For demonstration, assume carousel HTML is added externally.

    /********************************************************************
     * 6. SCRAPER CONTROL LOOP & ANALYSIS FUNCTIONS
     ********************************************************************/
    async function handleStartButtonClick() {
        if (scraperState === "running") {
            console.log("Already running.");
            return;
        }
        if (scraperState === "paused") {
            scraperState = "running";
            statusEl.textContent = `Status: running (resumed)`;
            runScraperLoop();
        } else {
            scraperState = "running";
            statusEl.textContent = `Status: running`;
            asinQueue = [];
            currentReviewIndex = 0;
            scrapedReviewData = {};
            const extractedAsins = extractAsins();
            if (extractedAsins.length === 0) {
                scraperState = "idle";
                statusEl.textContent = `Status: idle (no ASINs found)`;
                progressEl.innerHTML = "No ASINs found on this page.";
                return;
            }
            asinQueue = extractedAsins;
            console.log("Extracted ASINs:", asinQueue);
            progressData = asinQueue.reduce((acc, asin) => { acc[asin] = { step: "pending" }; return acc; }, {});
            updateOverallProgressUI();
            analyzeReviewsBtn.disabled = true;
            analyzeCriticalBtn.disabled = true;
            try {
                const response = await fetch("http://localhost:3000/start-scrape", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ asins: asinQueue })
                });
                if (!response.ok) {
                    const message = `Failed to start scrape. Status: ${response.status}`;
                    statusEl.textContent = `Status: Error - ${message}`;
                    scraperState = "idle";
                    throw new Error(message);
                }
                const data = await response.json();
                console.log("Scrape started:", data);
                statusEl.textContent = `Status: running (started)`;
                runScraperLoop();
            } catch (error) {
                console.error("Error starting scrape:", error);
                statusEl.textContent = `Status: Error - ${error.message}`;
                scraperState = "idle";
            }
        }
    }

    function handlePauseButtonClick() {
        if (scraperState === "running") {
            scraperState = "paused";
            statusEl.textContent = `Status: paused`;
            console.log("Paused scraping.");
        }
    }

    function handleStopButtonClick() {
        scraperState = "stopped";
        statusEl.textContent = `Status: stopped`;
        console.log("Stopped scraping.");
        analyzeReviewsBtn.disabled = false;
        analyzeCriticalBtn.disabled = false;
    }

    async function handleAnalyzeButtonClick(reviewType) {
        if (scraperState !== "idle" && scraperState !== "stopped") {
            alert("Please stop scraping before analyzing.");
            return;
        }
        if (Object.keys(scrapedReviewData).length === 0) {
            alert("No reviews scraped yet.");
            return;
        }
        statusEl.textContent = `Status: Analyzing ${reviewType} reviews...`;
        progressEl.innerHTML = "Analyzing reviews, please wait...";
        analyzeReviewsBtn.disabled = true;
        analyzeCriticalBtn.disabled = true;
        for (const asin of asinQueue) {
            if (scrapedReviewData[asin] && scrapedReviewData[asin][`${reviewType}Reviews`]) {
                const reviewsForAnalysis = scrapedReviewData[asin][`${reviewType}Reviews`].map(r => r.body).filter(body => body);
                if (reviewsForAnalysis.length > 0) {
                    updateProgressForAsin(asin, `analyzing-${reviewType}-reviews`);
                    try {
                        const analysisResults = await analyzeSentiment(reviewsForAnalysis);
                        progressData[asin][`${reviewType}Analysis`] = analysisResults;
                        updateProgressForAsin(asin, `analysis-${reviewType}-done`, analysisResults);
                    } catch (error) {
                        console.error(`Error analyzing ${reviewType} for ASIN ${asin}:`, error);
                        updateProgressForAsin(asin, `analysis-${reviewType}-error`, error.message);
                    }
                } else {
                    updateProgressForAsin(asin, `analysis-${reviewType}-no-reviews`);
                }
            } else {
                updateProgressForAsin(asin, `analysis-${reviewType}-no-data`);
            }
        }
        statusEl.textContent = `Status: Analysis complete`;
        analyzeReviewsBtn.disabled = false;
        analyzeCriticalBtn.disabled = false;
        updateOverallProgressUI();
    }

    // New: Single review analysis via /analyze-review endpoint
    async function analyzeSingleReview(text) {
        try {
            const response = await fetch("http://localhost:3000/analyze-review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const analysis = await response.json();
            updateAnalysisUI(analysis);
        } catch (error) {
            console.error("Error analyzing review:", error);
            alert("Failed to analyze review text.");
        }
    }

    function updateAnalysisUI(analysis) {
        const bertLabelEl = document.getElementById("bertLabel");
        const bertConfidenceEl = document.getElementById("bertConfidence");
        const lrLabelEl = document.getElementById("lrLabel");
        const lrConfidenceEl = document.getElementById("lrConfidence");
        if (analysis && analysis.bert && analysis.lr) {
            bertLabelEl.textContent = `Prediction: ${analysis.bert.label} (${analysis.bert.confidence.toFixed(1)}%)`;
            bertConfidenceEl.style.width = `${analysis.bert.confidence}%`;
            lrLabelEl.textContent = `Prediction: ${analysis.lr.label} (${analysis.lr.confidence.toFixed(1)}%)`;
            lrConfidenceEl.style.width = `${analysis.lr.confidence}%`;
        } else {
            bertLabelEl.textContent = "Prediction: N/A";
            lrLabelEl.textContent = "Prediction: N/A";
        }
    }

    // Carousel functions for sample reviews
    function updateCarousel() {
        const reviewTextEl = document.getElementById("reviewText");
        reviewTextEl.textContent = `"${sampleReviews[currentReviewIndex]}"`;
        analyzeSingleReview(sampleReviews[currentReviewIndex]);
    }
    function nextReview() {
        currentReviewIndex = (currentReviewIndex + 1) % sampleReviews.length;
        updateCarousel();
    }
    function prevReview() {
        currentReviewIndex = (currentReviewIndex - 1 + sampleReviews.length) % sampleReviews.length;
        updateCarousel();
    }

    /********************************************************************
     * 7. SCRAPER CONTROL LOOP & UTILITY FUNCTIONS
     ********************************************************************/
    async function runScraperLoop() {
        if (scraperState !== "running") {
            scraperState = "running";
            statusEl.textContent = `Status: running`;
        }
        const scrapePromises = asinQueue.map(asin => scrapeAsin(asin));
        await Promise.all(scrapePromises);
        if (scraperState === "running") {
            scraperState = "idle";
            statusEl.textContent = `Status: idle (queue processed)`;
            progressEl.innerHTML = "All ASINs processed. Scraping complete.";
            analyzeReviewsBtn.disabled = false;
            analyzeCriticalBtn.disabled = false;
        }
    }

    async function scrapeAsin(asin) {
        if (scraperState !== 'running') return;
        updateProgressForAsin(asin, "scraping-details");
        let productDetailsHtml = null;
        try {
            productDetailsHtml = await fetchProductDetailsPage(asin);
            updateProgressForAsin(asin, "detailsDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "detailsError", error.message);
            return;
        }
        if (scraperState !== 'running') return;
        updateProgressForAsin(asin, "scraping-aod-main");
        let aodMainProductDetailsHtml = null;
        try {
            aodMainProductDetailsHtml = await fetchAodMainProductDetailsPage(asin);
            updateProgressForAsin(asin, "aodMainDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "aodMainError", error.message);
            return;
        }
        if (scraperState !== 'running') return;
        updateProgressForAsin(asin, "scraping-aod-sellers");
        let aodSellerInfoHtml = null;
        try {
            aodSellerInfoHtml = await fetchAodSellerInfoPage(asin);
            updateProgressForAsin(asin, "aodSellerDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "aodSellerError", error.message);
            return;
        }
        if (scraperState !== 'running') return;
        updateProgressForAsin(asin, "scraping-all-reviews");
        let allReviewsData = null;
        try {
            allReviewsData = await fetchReviewPage(asin, "all");
            updateProgressForAsin(asin, "allReviewsDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "allReviewsError", error.message);
            return;
        }
        if (scraperState !== 'running') return;
        updateProgressForAsin(asin, "scraping-critical-reviews");
        let criticalReviewsData = null;
        try {
            criticalReviewsData = await fetchReviewPage(asin, "critical");
            updateProgressForAsin(asin, "criticalReviewsDone", true);
        } catch (error) {
            updateProgressForAsin(asin, "criticalReviewsError", error.message);
            return;
        }
        if (scraperState !== 'running') return;
        updateProgressForAsin(asin, "sending-to-server");
        try {
            await sendReviewsToServer(asin, allReviewsData.accumulatedReviews, criticalReviewsData.accumulatedReviews, productDetailsHtml, allReviewsData.reviewHtml, aodMainProductDetailsHtml, aodSellerInfoHtml);
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
            else if (progressData[asin].detailsError || progressData[asin].aodMainError || progressData[asin].aodSellerError || progressData[asin].allReviewsError || progressData[asin].criticalReviewsError || progressData[asin].serverError) errorCount++;
            if (progressData[asin].analysisAllDone || progressData[asin].analysisCriticalDone) analysisCount++;
        });
        progressEl.innerHTML = `
            <p>Status: ${scraperState}</p>
            <p>Scraped: ${completedCount} / ${asinQueue.length}</p>
            <p>Analyzed: ${analysisCount} / ${asinQueue.length}</p>
            <p>Scrape Errors: ${errorCount}</p>
            ${asinQueue.map(asin => getAsinProgressHTML(asin)).join('')}
        `;
    }

    function getAsinProgressHTML(asin) {
        const p = progressData[asin];
        let summaryStatus = p.done ? "✅ Done" : (p.serverError || p.criticalReviewsError || p.allReviewsError || p.aodSellerError || p.aodMainError || p.detailsError ? "❌ Error" : "🔍 Scraping...");
        let statusColor = p.done ? "green" : (p.serverError ? "red" : "darkorange");
        return `
            <details style="margin-bottom:8px;border:1px solid #f3f4f6;background:#fafafa;padding:10px;border-radius:8px;">
                <summary style="font-size: 0.95em; font-weight: bold; color: ${statusColor}; cursor: pointer; list-style: none;">
                    ASIN: ${asin} - Status: ${summaryStatus} <span style="font-weight: normal; color: #777;">(Click to expand)</span>
                </summary>
            </details>
        `;
    }

    function updateProgressForAsin(asin, step, value = null) {
        if (!progressData[asin]) progressData[asin] = {};
        progressData[asin][step] = (value === null ? true : value);
        updateOverallProgressUI();
    }

    /********************************************************************
     * 8. UTILITY FUNCTIONS & SERVER COMMUNICATION
     ********************************************************************/
    async function sendReviewsToServer(asin, allReviews, criticalReviews, productDetailsHtml, reviewHtml, aodMainProductDetailsHtml, aodSellerInfoHtml) {
        const serverUrl = "http://localhost:3000/save-reviews";
        try {
            const response = await fetch(serverUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ asin, allReviews, criticalReviews, productDetailsHtml, reviewHtml, aodMainProductDetailsHtml, aodSellerInfoHtml })
            });
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const responseData = await response.json();
            console.log(`Server response for ASIN ${asin}:`, responseData);
        } catch (error) {
            console.error(`Error sending reviews for ASIN ${asin}:`, error);
            throw error;
        }
    }

    // Updated analyzeSentiment: now calls the Node endpoint /analyze-review for each review
    async function analyzeSentiment(reviewsTextArray) {
        const analysisServerUrl = "http://localhost:3000/analyze-review";
        let allPredictions = [];
        for (const text of reviewsTextArray) {
            try {
                const response = await fetch(analysisServerUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text })
                });
                if (!response.ok) throw new Error(`Analysis server error: ${response.status}`);
                const responseData = await response.json();
                // Use BERT prediction from the response
                allPredictions.push({
                    text,
                    prediction: responseData.bert.label,
                    confidence: responseData.bert.confidence
                });
            } catch (error) {
                console.error("Error during sentiment analysis:", error);
                throw error;
            }
        }
        return { predictions: allPredictions };
    }

    function extractAsins() {
        const asinElements = document.querySelectorAll('div[data-asin]');
        const asins = [];
        asinElements.forEach(el => { const asin = el.getAttribute('data-asin'); if (asin) asins.push(asin); });
        return asins;
    }

    async function fetchProductDetailsPage(asin) {
        const url = `https://www.amazon.com/dp/${asin}/`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error(`Error fetching product details for ASIN ${asin}:`, error);
            throw error;
        }
    }

    async function fetchAodMainProductDetailsPage(asin) {
        const url = `https://www.amazon.com/gp/product/ajax/ref=dp_aod_ALL_mbc?asin=${asin}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error(`Error fetching AOD Main for ASIN ${asin}:`, error);
            throw error;
        }
    }

    async function fetchAodSellerInfoPage(asin, pageNumber = 1) {
        const url = `https://www.amazon.com/gp/product/ajax/ref=aod_page_${pageNumber}?asin=${asin}&pageno=${pageNumber}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return await response.text();
        } catch (error) {
            console.error(`Error fetching AOD Seller Info for ASIN ${asin} on page ${pageNumber}:`, error);
            throw error;
        }
    }

    async function fetchReviewPage(asin, reviewType, pageUrl, accumulatedReviews) {
        const filterType = reviewType === "critical" ? "critical" : "all_reviews";
        if (!pageUrl) {
            pageUrl = `https://www.amazon.com/product-reviews/${asin}/?reviewerType=all_reviews&filterByStar=${filterType}&pageNumber=1`;
        }
        if (!accumulatedReviews) accumulatedReviews = [];
        let currentPageNumber = 1;
        try {
            const urlParams = new URLSearchParams(new URL(pageUrl).search);
            if (urlParams.get("pageNumber")) {
                currentPageNumber = parseInt(urlParams.get("pageNumber"), 10);
            }
        } catch (error) {
            console.warn("Could not parse pageNumber from URL:", pageUrl);
        }
        try {
            const response = await fetch(pageUrl);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            const html = await response.text();
            const parsedReviews = parseReviewsFromHtmlFragment(html);
            accumulatedReviews.push(...parsedReviews);
            const nextPageLink = findNextPageLinkHrefFromFragment(html);
            if (nextPageLink) {
                const nextPageUrl = new URL(nextPageLink, pageUrl).href;
                return fetchReviewPage(asin, reviewType, nextPageUrl, accumulatedReviews);
            } else {
                return { accumulatedReviews, reviewHtml: html };
            }
        } catch (error) {
            console.error(`Error in fetchReviewPage for ${reviewType}:`, error);
            throw error;
        }
    }

    function parseReviewsFromHtmlFragment(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const reviews = [];
        const reviewElements = doc.querySelectorAll('#cm_cr-review_list [data-hook="review"]');
        reviewElements.forEach(reviewEl => {
            reviews.push({
                reviewerName: reviewEl.querySelector('[data-hook="review-author"]')?.textContent.trim() || null,
                rating: reviewEl.querySelector('[data-hook="review-star-rating"] .a-icon-alt')?.textContent.trim() || null,
                title: reviewEl.querySelector('[data-hook="review-title"]')?.textContent.trim() || null,
                date: reviewEl.querySelector('[data-hook="review-date"]')?.textContent.trim() || null,
                body: reviewEl.querySelector('[data-hook="review-body"]')?.textContent.trim() || null
            });
        });
        return reviews;
    }

    function findNextPageLinkHrefFromFragment(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const nextLink = doc.querySelector(".a-pagination .a-last:not(.a-disabled) a");
        return nextLink ? nextLink.getAttribute("href") : null;
    }

})();
