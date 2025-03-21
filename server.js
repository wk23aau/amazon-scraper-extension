const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

/*********************************************************************
 * CONFIGURATION FOR QUEUE PERSISTENCE TO LOCAL FILE AND GITHUB
 *********************************************************************/
const QUEUE_FILE = path.join(__dirname, 'queue.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const GITHUB_REPO_OWNER = 'wk23aau';
const GITHUB_REPO_NAME = 'amazing-data';
const GITHUB_FILE_PATH = 'queue.json'; // Path in the repo to store the queue state

/*********************************************************************
 * GLOBAL STATE FOR SCRAPING
 *********************************************************************/
let scrapeState = 'idle';  // 'idle', 'running', 'paused', 'stopped'
let asinQueue = [];        // Holds a list of ASINs to scrape
let currentIndex = 0;      // Which ASIN are we on?
let progress = {
  total: 0,
  completed: 0,
  currentAsin: null,
  step: null,
  paginationPosition: 0  // New field to save current pagination page number
};

/*********************************************************************
 * UTILITY: SAVE QUEUE STATE LOCALLY AND UPDATE GITHUB
 *********************************************************************/
function saveQueueState() {
  const state = { scrapeState, asinQueue, currentIndex, progress };
  // Save to local file
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(state, null, 2));
  console.log('[SERVER DEBUG] Queue state saved locally.');

  // Update GitHub file asynchronously
  updateGitHubQueueFile(state);
}

async function updateGitHubQueueFile(state) {
  const content = Buffer.from(JSON.stringify(state, null, 2)).toString('base64');
  let sha = null;
  try {
    const getResponse = await axios.get(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_FILE_PATH}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    sha = getResponse.data.sha;
  } catch (error) {
    console.error('[SERVER DEBUG] Could not fetch existing GitHub file (it might not exist):', error.message);
  }

  const payload = {
    message: "Update queue state",
    content: content,
    branch: "main"
  };
  if (sha) {
    payload.sha = sha;
  }
  try {
    const putResponse = await axios.put(`https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${GITHUB_FILE_PATH}`, payload, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    console.log('[SERVER DEBUG] GitHub queue file updated:', putResponse.data.commit.message);
  } catch (error) {
    console.error('[SERVER DEBUG] Error updating GitHub queue file:', error.message);
  }
}

/*********************************************************************
 * 1. CONTROL ENDPOINTS
 *********************************************************************/
app.post('/start-scrape', (req, res) => {
  if (!Array.isArray(req.body.asins) || req.body.asins.length === 0) {
    return res.status(400).json({
      error: 'Please provide a non-empty "asins" array in the request body.'
    });
  }
  // Initialize the ASIN queue with the first batch
  asinQueue = req.body.asins;
  currentIndex = 0;
  scrapeState = 'running';

  // Accept paginationPosition if provided
  if (req.body.paginationPosition) {
    progress.paginationPosition = req.body.paginationPosition;
  }

  progress.total = asinQueue.length;
  progress.completed = 0;
  progress.currentAsin = asinQueue[0];
  progress.step = 'initializing';

  console.log('[SERVER DEBUG] Scrape started. ASIN queue:', asinQueue);
  saveQueueState();

  res.json({
    message: 'Scraping started',
    state: scrapeState,
    totalAsins: asinQueue.length
  });
});

// New endpoint: Append additional ASINs to the existing queue
app.post('/append-asins', (req, res) => {
  if (!Array.isArray(req.body.asins) || req.body.asins.length === 0) {
    return res.status(400).json({
      error: 'Please provide a non-empty "asins" array in the request body.'
    });
  }
  const newAsins = req.body.asins;
  asinQueue = asinQueue.concat(newAsins);
  progress.total = asinQueue.length;
  // Update paginationPosition if provided
  if (req.body.paginationPosition) {
    progress.paginationPosition = req.body.paginationPosition;
  }
  console.log('[SERVER DEBUG] Appended ASINs. New queue:', asinQueue);
  saveQueueState();
  res.json({
    message: 'ASINs appended successfully',
    totalAsins: asinQueue.length
  });
});

app.post('/pause-scrape', (req, res) => {
  if (scrapeState !== 'running') {
    return res.status(400).json({
      error: `Cannot pause. Current state is '${scrapeState}'.`
    });
  }
  scrapeState = 'paused';
  console.log('[SERVER DEBUG] Scrape paused.');
  saveQueueState();
  res.json({ message: 'Scraping paused', state: scrapeState });
});

app.post('/stop-scrape', (req, res) => {
  scrapeState = 'stopped';
  console.log('[SERVER DEBUG] Scrape stopped by user.');
  saveQueueState();
  res.json({ message: 'Scraping stopped', state: scrapeState });
});

/*********************************************************************
 * 1.5. CHECK ASINS EXIST ENDPOINT
 *********************************************************************/
app.post('/check-asins-exist', (req, res) => {
  if (!Array.isArray(req.body.asins) || req.body.asins.length === 0) {
    return res.status(400).json({
      error: 'Please provide a non-empty "asins" array in the request body.'
    });
  }
  const requestedAsins = req.body.asins;
  const existingAsins = [];
  const newAsins = [];
  const reviewDataDir = './review_data';
  if (!fs.existsSync(reviewDataDir)) {
    fs.mkdirSync(reviewDataDir);
  }
  requestedAsins.forEach(asin => {
    const filenamePattern = `reviews_all_details_${asin}_all_critical_`;
    const existingFiles = fs.readdirSync(reviewDataDir).filter(file => file.startsWith(filenamePattern));
    if (existingFiles.length > 0) {
      existingAsins.push(asin);
    } else {
      newAsins.push(asin);
    }
  });
  res.json({
    existingAsins: existingAsins,
    newAsins: newAsins
  });
});

/*********************************************************************
 * 2. GET NEXT ASIN
 *********************************************************************/
app.get('/next-asin', (req, res) => {
  if (scrapeState !== 'running') {
    return res.json({
      asin: null,
      state: scrapeState,
      message: `Scraper not in 'running' state (current: ${scrapeState}).`,
    });
  }
  if (currentIndex >= asinQueue.length) {
    scrapeState = 'idle';
    return res.json({
      asin: null,
      state: scrapeState,
      message: 'No more ASINs to scrape. Queue is complete.',
    });
  }
  const asin = asinQueue[currentIndex];
  progress.currentAsin = asin;
  progress.step = 'fetching';
  console.log(`[SERVER DEBUG] Providing next ASIN: ${asin}`);
  res.json({
    asin,
    state: scrapeState,
    index: currentIndex,
    total: asinQueue.length,
  });
  currentIndex++;
  saveQueueState();
});

/*********************************************************************
 * 3. STATUS ENDPOINT
 *********************************************************************/
app.get('/status', (req, res) => {
  res.json({
    scrapeState,
    progress,
    queueLength: asinQueue.length,
    currentIndex,
  });
});

/*********************************************************************
 * 4. RECEIVE RESULTS: /save-reviews
 *********************************************************************/
app.post('/save-reviews', async (req, res) => {
  const {
    asin,
    allReviews,
    criticalReviews,
    productDetailsHtml,
    aodMainProductDetailsHtml,
    aodSellerInfoHtml
  } = req.body;

  if (
    !asin ||
    !allReviews ||
    !criticalReviews ||
    !Array.isArray(allReviews) ||
    !Array.isArray(criticalReviews)
  ) {
    console.error("[SERVER DEBUG] Invalid request body received:", req.body);
    return res.status(400).json({ error: 'Invalid request body. Expecting ASIN, allReviews, and criticalReviews arrays.' });
  }

  try {
    // Create directories for saving data if they don't exist
    const reviewsDir = path.join('.', 'amazing-data', 'raw', 'reviews');
    const htmlDir = path.join('.', 'amazing-data', 'raw', 'html');
    if (!fs.existsSync(reviewsDir)) {
      fs.mkdirSync(reviewsDir, { recursive: true });
    }
    if (!fs.existsSync(htmlDir)) {
      fs.mkdirSync(htmlDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:T\-Z\.]/g, '_');

    // Save reviews JSON file
    const reviewsFilename = `${asin}-Reviews-${timestamp}.json`;
    const reviewsFilePath = path.join(reviewsDir, reviewsFilename);
    fs.writeFileSync(
      reviewsFilePath,
      JSON.stringify({ asin, allReviews, criticalReviews }, null, 2)
    );

    // Save raw HTML for product details
    const productDetailsFilename = `${asin}-ProductDetails-${timestamp}.html`;
    const productDetailsFilePath = path.join(htmlDir, productDetailsFilename);
    fs.writeFileSync(productDetailsFilePath, productDetailsHtml || '');

    // Combine AOD HTML details (main and seller info) into one file
    const aodDetailsHtml = (aodMainProductDetailsHtml || '') + "\n" + (aodSellerInfoHtml || '');
    const aodFilename = `${asin}-aodDetails-${timestamp}.html`;
    const aodFilePath = path.join(htmlDir, aodFilename);
    fs.writeFileSync(aodFilePath, aodDetailsHtml);

    console.log(`[SERVER DEBUG] Successfully saved data for ASIN ${asin}.`);

    if (progress.currentAsin === asin) {
      progress.completed++;
      progress.step = 'done';
      console.log(`[SERVER DEBUG] Marked ASIN ${asin} as completed. (${progress.completed}/${progress.total})`);
    }

    saveQueueState();

    res.json({
      message: `Data for ASIN ${asin} saved successfully.`,
      reviewsFilename
    });
  } catch (error) {
    console.error("[SERVER DEBUG] Error saving data to file:", error);
    res.status(500).json({ error: 'Error saving data to file.' });
  }
});

/*********************************************************************
 * 5. START SERVER
 *********************************************************************/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
