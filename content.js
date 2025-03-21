(function() {
  // Global state variables
  let scrapeState = 'idle'; // Controls processing of product details/reviews (pause/resume/stop)
  let processingQueue = false;
  let totalAsinsCount = 0;  // Running total of ASINs collected
  let totalPages = 0;       // Total pages in the main search results

  // --------------------------------------------
  // Create Floating Widget UI
  // --------------------------------------------
  function createFloatingWidget() {
    const widget = document.createElement('div');
    widget.id = 'floatingWidget';
    widget.style.position = 'fixed';
    widget.style.top = '10px';
    widget.style.right = '10px';
    widget.style.zIndex = '9999';
    widget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    widget.style.color = '#fff';
    widget.style.padding = '10px';
    widget.style.borderRadius = '5px';
    widget.style.fontFamily = 'Arial, sans-serif';
    widget.style.fontSize = '14px';

    const title = document.createElement('div');
    title.innerText = 'Scraper Control';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    widget.appendChild(title);

    const startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.innerText = 'Start';
    widget.appendChild(startButton);

    // These buttons control the processing (product details/reviews) phase.
    const pauseButton = document.createElement('button');
    pauseButton.id = 'pauseButton';
    pauseButton.innerText = 'Pause';
    widget.appendChild(pauseButton);

    const resumeButton = document.createElement('button');
    resumeButton.id = 'resumeButton';
    resumeButton.innerText = 'Resume';
    widget.appendChild(resumeButton);

    const stopButton = document.createElement('button');
    stopButton.id = 'stopButton';
    stopButton.innerText = 'Stop';
    widget.appendChild(stopButton);

    // Progress display for ASIN collection
    const progressDisplay = document.createElement('div');
    progressDisplay.id = 'asinProgress';
    progressDisplay.style.marginTop = '5px';
    progressDisplay.innerText = 'Page: 0 / 0 | Total ASINs: 0';
    widget.appendChild(progressDisplay);

    // HTML5 progress bar
    const progressBar = document.createElement('progress');
    progressBar.id = 'asinProgressBar';
    progressBar.style.width = '100%';
    progressBar.value = 0;
    progressBar.max = 0;
    widget.appendChild(progressBar);

    document.body.appendChild(widget);
  }

  createFloatingWidget();

  // --------------------------------------------
  // Utility: Sleep function for delays
  // --------------------------------------------
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --------------------------------------------
  // Helper: Construct a page URL given a page number.
  // This modifies the current URL's "page" query parameter.
  // --------------------------------------------
  function constructPageURL(pageNumber) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', pageNumber);
    return currentUrl.toString();
  }

  // --------------------------------------------
  // Phase 1: Concurrent ASIN Collection in Batches
  // --------------------------------------------
  async function collectAllAsinsConcurrently() {
    // Determine total pages using the disabled pagination items.
    const disabledPaginationItems = document.querySelectorAll('.s-pagination-item.s-pagination-disabled');
    if (disabledPaginationItems.length > 0) {
      const lastDisabledItem = disabledPaginationItems[disabledPaginationItems.length - 1];
      totalPages = parseInt(lastDisabledItem.textContent.trim());
    } else {
      console.warn("Could not determine total pages. Assuming 1 page.");
      totalPages = 1;
    }
    console.log("Total pages determined:", totalPages);

    // Update progress bar maximum.
    const progressBar = document.getElementById('asinProgressBar');
    if (progressBar) {
      progressBar.max = totalPages;
    }

    // Prompt user for concurrent batch size for main pages (e.g., 50)
    let concurrentPages = prompt("How many concurrent main pages to fetch at a time?", "50");
    concurrentPages = parseInt(concurrentPages) || 1;
    console.log("Concurrent main page batch size set to:", concurrentPages);

    // Process pages in batches.
    for (let batchStart = 1; batchStart <= totalPages; batchStart += concurrentPages) {
      const batchEnd = Math.min(batchStart + concurrentPages - 1, totalPages);
      console.log(`Fetching main pages ${batchStart} to ${batchEnd} concurrently.`);
      const promises = [];
      for (let page = batchStart; page <= batchEnd; page++) {
        const url = constructPageURL(page);
        console.log(`Constructed URL for main page ${page}: ${url}`);
        promises.push(
          fetch(url)
            .then(response => response.text())
            .then(html => {
              const pageAsins = extractAsinsFromHTML(html, page);
              totalAsinsCount += pageAsins.length;
              // Update UI progress info.
              const progressDisplay = document.getElementById('asinProgress');
              if (progressDisplay) {
                progressDisplay.innerText = `Page: ${page} / ${totalPages} | Total ASINs: ${totalAsinsCount}`;
              }
              if (progressBar) {
                progressBar.value = page;
              }
              // Send this page's ASINs (fire-and-forget).
              sendPageASINs(pageAsins, page === 1, page);
              return pageAsins;
            })
            .catch(err => {
              console.error(`Error fetching main page ${page}:`, err);
              return [];
            })
        );
      }
      await Promise.all(promises);
    }
    console.log('Final total ASINs collected:', totalAsinsCount);
  }

  // Extract ASINs from the HTML of a main page.
  function extractAsinsFromHTML(html, pageNumber) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const items = doc.querySelectorAll('[role="listitem"][data-asin]');
    const asins = [];
    items.forEach(item => {
      const asin = item.getAttribute('data-asin');
      if (asin && asin.trim() !== '') {
        asins.push(asin.trim());
      }
    });
    console.log(`Collected ASINs from main page ${pageNumber}:`, asins);
    return asins;
  }

  // Sends a batch (i.e. one main page's) ASINs to the server.
  // Uses /start-scrape for the first page and /append-asins for subsequent pages.
  async function sendPageASINs(pageAsins, isFirstPage, paginationPosition) {
    try {
      const endpoint = isFirstPage ? 'http://localhost:3000/start-scrape' : 'http://localhost:3000/append-asins';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asins: pageAsins, paginationPosition })
      })
        .then(response => response.json())
        .then(data => {
          console.log(`Server response for main page ${paginationPosition} ASINs:`, data);
        })
        .catch(error => {
          console.error('Error sending main page ASINs to server:', error);
        });
    } catch (error) {
      console.error('Error in sendPageASINs:', error);
    }
  }

  // --------------------------------------------
  // Phase 2: Processing the Scraping Queue (Product Details/Reviews)
  // --------------------------------------------
  // Two methods: sequential (if user inputs 0) and concurrent batch (if user inputs > 0).

  async function processQueueSequential() {
    if (processingQueue) return;
    processingQueue = true;
    console.log('Starting sequential processing of ASIN queue.');
    while (true) {
      if (scrapeState === 'paused') {
        console.log('Processing paused. Waiting...');
        await sleep(2000);
        continue;
      }
      if (scrapeState === 'stopped') {
        console.log('Processing stopped.');
        break;
      }
      const response = await fetch('http://localhost:3000/next-asin');
      const data = await response.json();
      if (!data.asin) {
        console.log('No more ASINs to process.');
        break;
      }
      console.log('Processing ASIN sequentially:', data.asin);
      await scrapeASIN(data.asin);
    }
    processingQueue = false;
    console.log('Finished sequential processing of ASIN queue.');
  }

  async function processQueueConcurrent(batchSize) {
    if (processingQueue) return;
    processingQueue = true;
    console.log(`Starting concurrent processing of ASIN queue with batch size ${batchSize}.`);
    while (true) {
      if (scrapeState === 'paused') {
        console.log('Processing paused. Waiting...');
        await sleep(2000);
        continue;
      }
      if (scrapeState === 'stopped') {
        console.log('Processing stopped.');
        break;
      }
      let batch = [];
      for (let i = 0; i < batchSize; i++) {
        const response = await fetch('http://localhost:3000/next-asin');
        const data = await response.json();
        if (!data.asin) break;
        batch.push(data.asin);
      }
      if (batch.length === 0) break;
      console.log('Processing ASIN batch concurrently:', batch);
      await Promise.all(batch.map(asin => scrapeASIN(asin)));
    }
    processingQueue = false;
    console.log('Finished concurrent processing of ASIN queue.');
  }

  // scrapeASIN() fetches product details and reviews for a single ASIN.
  async function scrapeASIN(asin) {
    try {
      const hostname = window.location.hostname;
      const amazonBase = hostname.includes('co.uk') ? 'www.amazon.co.uk' : 'www.amazon.com';
      const productUrl = `https://${amazonBase}/dp/${asin}`;
      const reviewsUrl = `https://${amazonBase}/product-reviews/${asin}`;

      const productResponse = await fetch(productUrl);
      const productHtml = await productResponse.text();

      const reviewsPageResponse = await fetch(reviewsUrl);
      const reviewsPageHtml = await reviewsPageResponse.text();

      const reviewsJson = await fetchReviewsJSON(asin);
      const aodMainHtml = '';
      const aodSellerHtml = '';

      await sendScrapedData(
        asin,
        reviewsJson.allReviews,
        reviewsJson.criticalReviews,
        productHtml,
        aodMainHtml,
        aodSellerHtml
      );
    } catch (error) {
      console.error(`Error scraping ASIN ${asin}:`, error);
    }
  }

  // Uses AJAX pagination (sequentially) to fetch reviews.
  async function fetchReviewsJSON(asin) {
    console.log(`Fetching reviews JSON for ASIN: ${asin}`);
    let allReviews = [];
    let criticalReviews = [];
    let page = 1;
    let hasNext = true;
    const hostname = window.location.hostname;
    const amazonBase = hostname.includes('co.uk') ? 'www.amazon.co.uk' : 'www.amazon.com';
    const baseUrl = `https://${amazonBase}/product-reviews/${asin}`;
    while (hasNext) {
      const url = `${baseUrl}/?pageNumber=${page}`;
      try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const reviewElements = doc.querySelectorAll('div[data-hook="review"]');
        if (reviewElements.length === 0) {
          console.log(`No reviews found on page ${page} for ASIN ${asin}. Ending pagination.`);
          break;
        }
        reviewElements.forEach(reviewEl => {
          const reviewTextEl = reviewEl.querySelector('span[data-hook="review-body"]');
          const reviewText = reviewTextEl ? reviewTextEl.innerText.trim() : "";
          const ratingEl = reviewEl.querySelector('i[data-hook="review-star-rating"], i[data-hook="cmps-review-star-rating"]');
          let rating = null;
          if (ratingEl) {
            const ratingText = ratingEl.innerText;
            const match = ratingText.match(/([\d.]+)\s*out\s*of\s*5/);
            rating = match ? parseFloat(match[1]) : null;
          }
          const reviewData = { reviewText, rating };
          allReviews.push(reviewData);
          if (rating !== null && rating < 3) {
            criticalReviews.push(reviewData);
          }
        });
        const nextPageBtn = doc.querySelector('li.a-last a');
        if (nextPageBtn) {
          page++;
          await sleep(1500);
        } else {
          hasNext = false;
        }
      } catch (error) {
        console.error(`Error fetching reviews on page ${page} for ASIN ${asin}:`, error);
        hasNext = false;
      }
    }
    return { allReviews, criticalReviews };
  }

  async function sendScrapedData(asin, allReviews, criticalReviews, productDetailsHtml, aodMainProductDetailsHtml, aodSellerInfoHtml) {
    try {
      const response = await fetch('http://localhost:3000/save-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asin,
          allReviews,
          criticalReviews,
          productDetailsHtml,
          aodMainProductDetailsHtml,
          aodSellerInfoHtml
        })
      });
      const data = await response.json();
      console.log(`Server response for ASIN ${asin} save:`, data);
    } catch (error) {
      console.error(`Error sending scraped data for ASIN ${asin}:`, error);
    }
  }

  // --------------------------------------------
  // UI Control: Attach event listeners to widget buttons
  // --------------------------------------------
  const startButton = document.getElementById('startButton');
  const pauseButton = document.getElementById('pauseButton');
  const resumeButton = document.getElementById('resumeButton');
  const stopButton = document.getElementById('stopButton');

  if (startButton) {
    startButton.addEventListener('click', async () => {
      console.log('Start button clicked.');
      // Phase 1: Concurrently collect all ASINs.
      await collectAllAsinsConcurrently();
      // Phase 2: Now prompt for product details/reviews processing method.
      let prodBatchInput = prompt("Enter product detail concurrent batch size (enter 0 for sequential AJAX method):", "50");
      prodBatchInput = parseInt(prodBatchInput) || 0;
      scrapeState = 'running';
      if (prodBatchInput === 0) {
        console.log("Processing product details/reviews sequentially.");
        await processQueueSequential();
      } else {
        console.log(`Processing product details/reviews concurrently in batches of ${prodBatchInput}.`);
        await processQueueConcurrent(prodBatchInput);
      }
    });
  }
  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      console.log('Pause button clicked.');
      scrapeState = 'paused';
    });
  }
  if (resumeButton) {
    resumeButton.addEventListener('click', () => {
      console.log('Resume button clicked.');
      if (scrapeState === 'paused') {
        scrapeState = 'running';
      }
    });
  }
  if (stopButton) {
    stopButton.addEventListener('click', () => {
      console.log('Stop button clicked.');
      scrapeState = 'stopped';
    });
  }
})();
