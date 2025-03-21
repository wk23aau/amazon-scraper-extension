const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Directory for raw HTML saving
const rawHtmlDir = 'C:\\Users\\Khan Waseem\\OneDrive - University of Hertfordshire\\7COM1018-0901-2024 - Data Mining\\amazing-data\\raw';

// In-memory ASIN queue
let queue = [];
let scrapingActive = false;

// Enqueue endpoint – receives an array of ASINs from content.js
app.post('/enqueue', (req, res) => {
  const { asins } = req.body;
  if (!Array.isArray(asins)) {
    return res.status(400).json({ error: 'asins must be an array.' });
  }
  asins.forEach(asin => {
    // Avoid duplicates in the queue
    if (!queue.find(item => item.asin === asin)) {
      queue.push({ asin, status: 'pending' });
    }
  });
  scrapingActive = true;
  console.log(`[server1] Enqueued ASINs: ${asins.join(', ')}`);
  res.json({ message: 'ASINs enqueued successfully.', queue });
});

// Save HTML endpoint – receives fetched HTML from content.js and updates queue status
app.post('/save-html', (req, res) => {
  const { asin, reviewHtml, criticalReviewHtml, productDetailsHtml, aodMainProductDetailsHtml, aodSellerInfoHtml } = req.body;

  if (!asin) {
    return res.status(400).json({ error: 'ASIN is required.' });
  }

  if (!fs.existsSync(rawHtmlDir)) {
    fs.mkdirSync(rawHtmlDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:T\-Z\.]/g, '_');

  if (reviewHtml) {
    const reviewFilename = path.join(rawHtmlDir, `raw_reviews_ASIN_${asin}_${timestamp}.html`);
    fs.writeFileSync(reviewFilename, reviewHtml);
    console.log(`[server1] Saved reviews HTML for ASIN ${asin} to ${reviewFilename}`);
  }

  if (criticalReviewHtml) {
    const criticalFilename = path.join(rawHtmlDir, `raw_critical_reviews_ASIN_${asin}_${timestamp}.html`);
    fs.writeFileSync(criticalFilename, criticalReviewHtml);
    console.log(`[server1] Saved critical reviews HTML for ASIN ${asin} to ${criticalFilename}`);
  }

  if (productDetailsHtml) {
    const detailsFilename = path.join(rawHtmlDir, `raw_product_details_ASIN_${asin}_${timestamp}.html`);
    fs.writeFileSync(detailsFilename, productDetailsHtml);
    console.log(`[server1] Saved product details HTML for ASIN ${asin} to ${detailsFilename}`);
  }
  
  if (aodMainProductDetailsHtml) {
    const aodMainDetailsFilename = path.join(rawHtmlDir, `raw_aod_main_details_ASIN_${asin}_${timestamp}.html`);
    fs.writeFileSync(aodMainDetailsFilename, aodMainProductDetailsHtml);
    console.log(`[server1] Saved AOD main details HTML for ASIN ${asin} to ${aodMainDetailsFilename}`);
  }
  
  if (aodSellerInfoHtml) {
    const aodSellerInfoFilename = path.join(rawHtmlDir, `raw_aod_seller_info_ASIN_${asin}_${timestamp}.html`);
    fs.writeFileSync(aodSellerInfoFilename, aodSellerInfoHtml);
    console.log(`[server1] Saved AOD seller info HTML for ASIN ${asin} to ${aodSellerInfoFilename}`);
  }

  // Update the queue for this ASIN
  const queueItem = queue.find(item => item.asin === asin);
  if (queueItem) {
    queueItem.status = 'done';
  }
  res.json({ message: 'HTML saved successfully.', asin });
});

// Interrupt endpoint – stops scraping and leaves the queue intact
app.post('/interrupt', (req, res) => {
  scrapingActive = false;
  console.log('[server1] Scraping interrupted by client.');
  res.json({ message: 'Scraping interrupted. Queue remains intact.', queue });
});

// Resume endpoint – resumes scraping from the existing queue
app.post('/resume', (req, res) => {
  scrapingActive = true;
  console.log('[server1] Scraping resumed by client.');
  res.json({ message: 'Resuming scraping from queue.', queue });
});

// Status endpoint – returns current queue status and a paginate flag if all items are done
app.get('/status', (req, res) => {
  const allDone = queue.length > 0 && queue.every(item => item.status === 'done');
  res.json({ scrapingActive, queue, paginate: allDone });
});

app.listen(port, () => {
  console.log(`[server1] Server listening at http://localhost:${port}`);
});
