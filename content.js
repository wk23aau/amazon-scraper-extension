// content.js
(function() {
    console.log("Amazon Scraper content script loaded.");
  
    /********************************************************************
     * 1. GLOBAL STATE
     ********************************************************************/
    let scraperState = "idle";
    let asinQueue = [];
    let progressData = {}; // Progress tracked per ASIN now
  
    /********************************************************************
     * 2. STYLES - Reusable styles for UI elements
     ********************************************************************/
    const floatingContainerStyles = {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "999999",    // Large zIndex to be on top
        background: "#fff", // White background - cleaner
        border: "1px solid #ccc", // Lighter border
        padding: "15px", // Slightly more padding
        borderRadius: "5px", // Softer rounded corners
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // More modern font
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)" // Softer shadow
    };
  
    const titleStyles = {
        fontWeight: "bold",
        marginBottom: "10px", // More margin below title
        fontSize: "1.1em" // Slightly larger title font
    };
  
    const statusStyles = {
        marginBottom: "8px", // Adjusted margin
        fontSize: "0.95em" // Slightly smaller status font
    };
  
    const progressStyles = {
        marginBottom: "10px", // Adjusted margin
        fontSize: "0.95em" // Slightly smaller progress font
    };
  
    const buttonBaseStyle = {
        padding: "8px 12px",
        marginRight: "5px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        color: "#fff",
        fontSize: "0.9em"
    };
  
    const startButtonStyle = {
        backgroundColor: "#28a745" // Green for Start
    };
    const startButtonHoverStyle = {
        backgroundColor: "#218838" // Darker green on hover
    };
  
    const pauseButtonStyle = {
        backgroundColor: "#ffc107", // Yellow for Pause
        color: "#212529" // Dark text for yellow button
    };
    const pauseButtonHoverStyle = {
        backgroundColor: "#ffca2c" // Lighter yellow on hover
    };
  
    const stopButtonStyle = {
        backgroundColor: "#dc3545" // Red for Stop
    };
    const stopButtonHoverStyle = {
        backgroundColor: "#c82333" // Darker red on hover
    };
  
  
    /********************************************************************
     * 3. OVERLAY / FLOATING UI - Element Creation and Styling Application
     ********************************************************************/
    // Create floating buttons container
    const floatingContainer = document.createElement("div");
    Object.assign(floatingContainer.style, floatingContainerStyles); // Apply container styles
    floatingContainer.id = "amazonScraperFloatingUI";
  
    // Title
    const titleEl = document.createElement("div");
    titleEl.textContent = "Amazon Scraper Control";
    Object.assign(titleEl.style, titleStyles); // Apply title styles
    floatingContainer.appendChild(titleEl);
  
    // Status display
    const statusEl = document.createElement("div");
    statusEl.textContent = "Status: idle";
    Object.assign(statusEl.style, statusStyles); // Apply status styles
    floatingContainer.appendChild(statusEl);
  
    // Progress display
    const progressEl = document.createElement("div");
    Object.assign(progressEl.style, progressStyles); // Apply progress styles
    progressEl.innerHTML = "Progress: N/A";
    floatingContainer.appendChild(progressEl);
  
    // Create Start, Pause, Stop buttons
    const startBtn = document.createElement("button");
    startBtn.innerText = "Start";
    Object.assign(startBtn.style, buttonBaseStyle, startButtonStyle); // Apply base and start styles
    startBtn.addEventListener("mouseover", () => Object.assign(startBtn.style, startButtonHoverStyle));
    startBtn.addEventListener("mouseout", () => Object.assign(startBtn.style, startButtonStyle));
  
  
    const pauseBtn = document.createElement("button");
    pauseBtn.innerText = "Pause";
    Object.assign(pauseBtn.style, buttonBaseStyle, pauseButtonStyle); // Apply base and pause styles
    pauseBtn.addEventListener("mouseover", () => Object.assign(pauseBtn.style, pauseButtonHoverStyle));
    pauseBtn.addEventListener("mouseout", () => Object.assign(pauseBtn.style, pauseButtonStyle));
  
    const stopBtn = document.createElement("button");
    stopBtn.innerText = "Stop";
    Object.assign(stopBtn.style, buttonBaseStyle, stopButtonStyle); // Apply base and stop styles
    stopBtn.addEventListener("mouseover", () => Object.assign(stopBtn.style, stopButtonHoverStyle));
    stopBtn.addEventListener("mouseout", () => Object.assign(stopBtn.style, stopButtonStyle));
  
  
    floatingContainer.appendChild(startBtn);
    floatingContainer.appendChild(pauseBtn);
    floatingContainer.appendChild(stopBtn);
  
    // Add container to the document
    document.body.appendChild(floatingContainer);
  
    /********************************************************************
     * 4. EVENT LISTENERS FOR BUTTONS - Functional Logic
     ********************************************************************/
    startBtn.addEventListener("click", handleStartButtonClick);
    pauseBtn.addEventListener("click", handlePauseButtonClick);
    stopBtn.addEventListener("click", handleStopButtonClick);
  
    /********************************************************************
     * 5. BUTTON EVENT HANDLER FUNCTIONS - Functional Logic
     ********************************************************************/
    async function handleStartButtonClick() {
        if (scraperState === "running") {
            console.log("Already running. No action taken.");
            return;
        }
        // If we were paused, unpause. If we were idle/stopped, re-initialize.
        if (scraperState === "paused") {
            scraperState = "running";
            statusEl.textContent = `Status: running (resumed)`;
            runScraperLoop(); // Resume
        } else {
            // new start
            scraperState = "running";
            statusEl.textContent = `Status: running`;
            asinQueue = [];
            currentIndex = 0;
  
            // **Extract ASINs from the page**
            const extractedAsins = extractAsins();
            if (extractedAsins.length === 0) {
                scraperState = "idle";
                statusEl.textContent = `Status: idle (no ASINs found on page)`;
                progressEl.innerHTML = "No ASINs found on the current page. Please navigate to a page with product listings.";
                console.log("No ASINs found on page, scrape not started.");
                return;
            }
            asinQueue = extractedAsins;
            console.log("Extracted ASINs from page:", asinQueue);
  
            // **Initialize progressData for all ASINs**
            progressData = asinQueue.reduce((acc, asin) => {
                acc[asin] = {
                    step: "pending",
                    detailsDone: false,
                    aodMainDone: false,
                    aodSellerDone: false,
                    allReviewsDone: false,
                    criticalReviewsDone: false
                };
                return acc;
            }, {});
            updateOverallProgressUI(); // Initial update
  
  
            // **Send ASINs to /start-scrape endpoint**
            try {
                const response = await fetch("http://localhost:3000/start-scrape", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ asins: asinQueue })
                });
  
                if (!response.ok) {
                    const message = `Failed to start scrape. Server status: ${response.status}`;
                    statusEl.textContent = `Status: Error - ${message}`;
                    scraperState = "idle";
                    throw new Error(message);
                }
  
                const data = await response.json();
                console.log("Scrape started on server:", data);
                statusEl.textContent = `Status: running (started)`;
                runScraperLoop(); // Start the scraping loop
  
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
        // Optional: clear queue or do any other cleanup
    }
  
  
    /********************************************************************
     * 6. SCRAPER CONTROL LOOP - Functional Logic
     ********************************************************************/
    async function runScraperLoop() {
        if (scraperState !== "running") {
            scraperState = "running";
            statusEl.textContent = `Status: running`;
        }
  
        // Initiate scraping for all ASINs in the queue
        const scrapePromises = asinQueue.map(asin => scrapeAsin(asin));
  
        // Wait for all scraping promises to resolve (or reject)
        await Promise.all(scrapePromises);
  
        if (scraperState === "running") { // Check state again after all promises
            scraperState = "idle";
            statusEl.textContent = `Status: idle (queue processed)`;
            progressEl.innerHTML = "All ASINs processed.";
            console.log("All ASINs processed. Queue complete.");
        }
    }
  
  
    /********************************************************************
     * 7. MAIN SCRAPING LOGIC FOR ONE ASIN - Functional Logic
     ********************************************************************/
    async function scrapeAsin(asin) {
        if (scraperState !== 'running') return; // Exit if scraping is stopped or paused
  
        updateProgressForAsin(asin, "scraping-details");
        let productDetailsHtml = null;
        try {
            productDetailsHtml = await fetchProductDetailsPage(asin);
            updateProgressForAsin(asin, "detailsDone", true);
        } catch (error) {
            console.error(`Error fetching details for ASIN ${asin}:`, error);
            updateProgressForAsin(asin, "detailsError", error.message);
            return; // Stop processing this ASIN further on error
        }
  
        if (scraperState !== 'running') return;
  
        updateProgressForAsin(asin, "scraping-aod-main");
        let aodMainProductDetailsHtml = null;
        try {
            aodMainProductDetailsHtml = await fetchAodMainProductDetailsPage(asin);
            updateProgressForAsin(asin, "aodMainDone", true);
        } catch (error) {
            console.error(`Error fetching AOD Main details for ASIN ${asin}:`, error);
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
            console.error(`Error fetching AOD Seller info for ASIN ${asin}:`, error);
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
            console.error(`Error fetching all reviews for ASIN ${asin}:`, error);
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
            console.error(`Error fetching critical reviews for ASIN ${asin}:`, error);
            updateProgressForAsin(asin, "criticalReviewsError", error.message);
            return;
        }
  
        if (scraperState !== 'running') return;
  
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
            console.log(`Finished scraping and sent data for ASIN: ${asin}`);
        } catch (error) {
            console.error(`Error sending data to server for ASIN ${asin}:`, error);
            updateProgressForAsin(asin, "serverError", error.message);
        }
    }
  
    /********************************************************************
     * 8. PROGRESS / STATUS UI - **UPDATED PROGRESS UI** - Functional Logic & UI Updates
     ********************************************************************/
  
    function updateOverallProgressUI() {
        let completedCount = 0;
        let errorCount = 0;
        Object.keys(progressData).forEach(asin => {
            if (progressData[asin].done) {
                completedCount++;
            } else if (progressData[asin].detailsError || progressData[asin].aodMainError || progressData[asin].aodSellerError || progressData[asin].allReviewsError || progressData[asin].criticalReviewsError || progressData[asin].serverError) {
                errorCount++;
            }
        });
  
        progressEl.innerHTML = `
            <p>Status: ${scraperState}</p>
            <p>Completed: ${completedCount} / ${asinQueue.length}</p>
            <p>Errors: ${errorCount}</p>
            ${asinQueue.map(asin => getAsinProgressHTML(asin)).join('')}
        `;
    }
  
    function getAsinProgressHTML(asin) {
        const p = progressData[asin];
        let statusText = "";
        let statusColor = ""; // Added for status text color
        let summaryStatus = ""; // Shorter status for summary
  
        if (p.done) {
            statusText = "Done";
            summaryStatus = "✅ Done"; // More concise for summary
            statusColor = "green"; // Green for success
        } else if (p.serverError || p.criticalReviewsError || p.allReviewsError || p.aodSellerError || p.aodMainError || p.detailsError) {
            statusText = "Error";
            summaryStatus = "❌ Error"; // More concise for summary
            statusColor = "red"; // Red for errors
        } else if (p.step === "sending-to-server") {
            statusText = "Sending to Server...";
            summaryStatus = "⬆️ Sending..."; // More concise for summary
            statusColor = "royalblue"; // Blue for sending
        } else if (p.step === "scraping-critical-reviews" || p.step === "scraping-all-reviews" || p.step === "scraping-aod-sellers" || p.step === "scraping-aod-main" || p.step === "scraping-details") {
            statusText = "Scraping...";
            summaryStatus = "🔍 Scraping..."; // More concise for summary
            statusColor = "darkorange"; // Orange for scraping
        } else if (p.step === "pending") {
            statusText = "Pending...";
            summaryStatus = "⏳ Pending"; // More concise for summary
            statusColor = "goldenrod"; // Yellow/Gold for pending
        } else {
            statusText = "Initializing...";
            summaryStatus = "⏳ Initializing"; // More concise for summary
            statusColor = "grey"; // Grey for initializing
        }
  
  
        return `
            <details style="margin-bottom: 8px; border: 1px solid #eee; padding: 8px; border-radius: 4px;">
                <summary style="font-size: 0.95em; font-weight: bold; color: ${statusColor}; cursor: pointer; list-style: none;">
                    ASIN: ${asin} - Status: ${summaryStatus} <span style="font-weight: normal; color: #777;">(Click to expand)</span>
                </summary>
                <ul style="padding-left: 20px; margin-top: 5px;">
                    <li style="margin-bottom: 3px;">Details: ${p.detailsDone ? "✅" : (p.detailsError ? `<span style="color:red;">❌ Error</span>` : "...")}</li>
                    <li style="margin-bottom: 3px;">AOD Main: ${p.aodMainDone ? "✅" : (p.aodMainError ? `<span style="color:red;">❌ Error</span>` : "...")}</li>
                    <li style="margin-bottom: 3px;">AOD Seller: ${p.aodSellerDone ? "✅" : (p.aodSellerError ? `<span style="color:red;">❌ Error</span>` : "...")}</li>
                    <li style="margin-bottom: 3px;">All Reviews: ${p.allReviewsDone ? "✅" : (p.allReviewsError ? `<span style="color:red;">❌ Error</span>` : "...")}</li>
                    <li style="margin-bottom: 3px;">Critical Reviews: ${p.criticalReviewsDone ? "✅" : (p.criticalReviewsError ? `<span style="color:red;">❌ Error</span>` : "...")}</li>
                    <li>Server Send: ${p.done ? "✅" : (p.serverError ? `<span style="color:red;">❌ Error</span>` : "...")}</li>
                </ul>
                ${p.detailsError ? `<p style="color:red; margin-top: 5px; margin-left: 20px;">Details Error: ${p.detailsError}</p>` : ''}
                ${p.aodMainError ? `<p style="color:red; margin-top: 5px; margin-left: 20px;">AOD Main Error: ${p.aodMainError}</p>` : ''}
                ${p.aodSellerError ? `<p style="color:red; margin-top: 5px; margin-left: 20px;">AOD Seller Error: ${p.aodSellerError}</p>` : ''}
                ${p.allReviewsError ? `<p style="color:red; margin-top: 5px; margin-left: 20px;">All Reviews Error: ${p.allReviewsError}</p>` : ''}
                ${p.criticalReviewsError ? `<p style="color:red; margin-top: 5px; margin-left: 20px;">Critical Reviews Error: ${p.criticalReviewsError}</p>` : ''}
                ${p.serverError ? `<p style="color:red; margin-top: 5px; margin-left: 20px;">Server Error: ${p.serverError}</p>` : ''}
            </details>
        `;
    }
  
  
    function updateProgressForAsin(asin, step, value = null) {
        if (!progressData[asin]) {
            progressData[asin] = {};
        }
        if (step === "scraping-details" || step === "scraping-aod-main" || step === "scraping-aod-sellers" || step === "scraping-all-reviews" || step === "scraping-critical-reviews" || step === "sending-to-server") {
            progressData[asin].step = step;
        } else if (step === "detailsDone") {
            progressData[asin].detailsDone = true;
        } else if (step === "aodMainDone") {
            progressData[asin].aodMainDone = true;
        } else if (step === "aodSellerDone") {
            progressData[asin].aodSellerDone = true;
        } else if (step === "allReviewsDone") {
            progressData[asin].allReviewsDone = true;
        } else if (step === "criticalReviewsDone") {
            progressData[asin].criticalReviewsDone = true;
        } else if (step === "done") {
            progressData[asin].done = true;
            progressData[asin].step = "done"; // Final step
        } else if (step === "detailsError") {
            progressData[asin].detailsError = value;
        } else if (step === "aodMainError") {
            progressData[asin].aodMainError = value;
        } else if (step === "aodSellerError") {
            progressData[asin].aodSellerError = value;
        } else if (step === "allReviewsError") {
            progressData[asin].allReviewsError = value;
        } else if (step === "criticalReviewsError") {
            progressData[asin].criticalReviewsError = value;
        } else if (step === "serverError") {
            progressData[asin].serverError = value;
        }
  
        updateOverallProgressUI(); // Update UI after each progress change
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
     * 11. SERVER COMMUNICATION - Functional Logic
     ********************************************************************/
    async function sendReviewsToServer(
        asin,
        allReviews,
        criticalReviews,
        productDetailsHtml,
        reviewHtml,
        aodMainProductDetailsHtml,
        aodSellerInfoHtml
    ) {
        const serverUrl = "http://localhost:3000/save-reviews";
        try {
            const response = await fetch(serverUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    asin: asin,
                    allReviews: allReviews,
                    criticalReviews: criticalReviews,
                    productDetailsHtml: productDetailsHtml,
                    reviewHtml: reviewHtml,
                    aodMainProductDetailsHtml: aodMainProductDetailsHtml,
                    aodSellerInfoHtml: aodSellerInfoHtml
                })
            });
  
            if (!response.ok) {
                throw new Error(`Server error! status: ${response.status}`);
            }
            const responseData = await response.json();
            console.log(`Server response for ASIN ${asin}:`, responseData);
        } catch (error) {
            console.error(`Error sending reviews to server for ASIN ${asin}:`, error);
            throw error; // Re-throw
        }
    }
  
    /********************************************************************
     * 12. ASIN EXTRACTION FUNCTION - Functional Logic
     ********************************************************************/
    function extractAsins() {
        const asinElements = document.querySelectorAll('div[data-asin]');
        const asins = [];
        asinElements.forEach(element => {
            const asin = element.getAttribute('data-asin');
            if (asin) {
                asins.push(asin);
            }
        });
        return asins;
    }
  
  })();