// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const cheerio = require('cheerio');
const path = require('path'); // Need path module for file path manipulation

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

/*********************************************************************
 * 0. GLOBAL STATE FOR SCRAPING
 *********************************************************************/
let scrapeState = 'idle';  // 'idle', 'running', 'paused', 'stopped'
let asinQueue = [];        // Holds a list of ASINs to scrape
let currentIndex = 0;      // Which ASIN are we on?
// Basic progress info: you can track as many details as you like:
let progress = {
  total: 0,            // total ASINs in the queue
  completed: 0,        // how many ASINs have completed
  currentAsin: null,   // which ASIN is being worked on right now
  step: null,          // e.g. "scraping-details", "scraping-reviews", etc.
};

/*********************************************************************
 * 1. CONTROL ENDPOINTS
 *********************************************************************/

/**
 * POST /start-scrape
 * Body: { asins: ["B00XXXX", "B07YYYY", ...] }
 * - Resets the queue, sets state to 'running'.
 */
app.post('/start-scrape', (req, res) => {
  if (!Array.isArray(req.body.asins) || req.body.asins.length === 0) {
    return res.status(400).json({
      error: 'Please provide a non-empty "asins" array in the request body.'
    });
  }

  asinQueue = req.body.asins;
  currentIndex = 0;
  scrapeState = 'running';

  progress.total = asinQueue.length;
  progress.completed = 0;
  progress.currentAsin = asinQueue[0];
  progress.step = 'initializing';

  console.log('[SERVER DEBUG] Scrape started. ASIN queue:', asinQueue);

  res.json({
    message: 'Scraping started',
    state: scrapeState,
    totalAsins: asinQueue.length
  });
});

/**
 * POST /pause-scrape
 * - Sets state to 'paused'.
 */
app.post('/pause-scrape', (req, res) => {
  if (scrapeState !== 'running') {
    return res.status(400).json({
      error: `Cannot pause. Current state is '${scrapeState}'.`
    });
  }
  scrapeState = 'paused';
  console.log('[SERVER DEBUG] Scrape paused.');
  res.json({ message: 'Scraping paused', state: scrapeState });
});

/**
 * POST /stop-scrape
 * - Sets state to 'stopped'.
 */
app.post('/stop-scrape', (req, res) => {
  scrapeState = 'stopped';
  console.log('[SERVER DEBUG] Scrape stopped by user.');
  res.json({ message: 'Scraping stopped', state: scrapeState });
});

/*********************************************************************
 * 1.5. CHECK ASINS EXIST ENDPOINT (NEW)
 * POST /check-asins-exist
 * Body: { asins: ["B00XXXX", "B07YYYY", ...] }
 * - Checks which ASINs already have saved data on the server.
 */
app.post('/check-asins-exist', (req, res) => {
  if (!Array.isArray(req.body.asins) || req.body.asins.length === 0) {
    return res.status(400).json({
      error: 'Please provide a non-empty "asins" array in the request body.'
    });
  }

  const requestedAsins = req.body.asins;
  const existingAsins = [];
  const newAsins = [];

  if (!fs.existsSync('./review_data')) {
    fs.mkdirSync('./review_data'); // Ensure directory exists even if empty
  }

  requestedAsins.forEach(asin => {
    const filenamePattern = `reviews_all_details_${asin}_all_critical_`;
    const reviewDataDir = './review_data';

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
 *    The content script can periodically call GET /next-asin
 *    (or poll) to see if there's an ASIN to process.
 *    If we are 'running' and have more ASINs, return the next one,
 *    then increment currentIndex on the server.
 *********************************************************************/
app.get('/next-asin', (req, res) => {
  if (scrapeState !== 'running') {
    return res.json({
      asin: null,
      state: scrapeState,
      message: `Scraper not in 'running' state (current: ${scrapeState}).`,
    });
  }

  // If we are past the end of the queue, set to 'idle'
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

  // Move to the next index for the following request
  currentIndex++;
});

/*********************************************************************
 * 3. STATUS ENDPOINT
 *    The front-end can call GET /status to see the current
 *    scraping state, progress, which ASIN we’re on, etc.
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
 *
 *    This is your original endpoint, with no changes needed for
 *    receiving and saving the data. We only added extra logs that
 *    update the server-side progress info, so we know we completed
 *    an ASIN.
 *********************************************************************/
app.post('/save-reviews', async (req, res) => {
  const {
    asin,
    allReviews,
    criticalReviews,
    productDetailsHtml,
    reviewHtml,
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
    console.error("[SERVER DEBUG] Invalid request body received (reviews part):", req.body);
    return res.status(400).json({ error: 'Invalid request body. Expecting ASIN, allReviews, and criticalReviews arrays.' });
  }

  let parsedProductDetails = null;
  let parsedAodMainProductDetails = null;
  let parsedAodSellerInfo = null;

  if (productDetailsHtml) {
    parsedProductDetails = parseProductDetailsHtml(productDetailsHtml);
    console.log(`[SERVER DEBUG] Parsed main product details for ASIN: ${asin}`);
  } else {
    console.log(`[SERVER DEBUG] No main product details HTML received for ASIN: ${asin}`);
  }

  if (aodMainProductDetailsHtml) {
    parsedAodMainProductDetails = parseAodMainProductDetailsHtml(aodMainProductDetailsHtml);
    console.log(`[SERVER DEBUG] Parsed AOD Main Product Details for ASIN: ${asin}`);
  } else {
    console.log(`[SERVER DEBUG] No AOD Main Product Details HTML received for ASIN: ${asin}`);
  }

  if (aodSellerInfoHtml) {
    parsedAodSellerInfo = parseAodSellerInfoHtml(aodSellerInfoHtml);
    console.log(`[SERVER DEBUG] Parsed AOD Seller Info for ASIN: ${asin}`);
  } else {
    console.log(`[SERVER DEBUG] No AOD Seller Info HTML received for ASIN: ${asin}`);
  }

  try {
    if (!fs.existsSync('./review_data')) {
      fs.mkdirSync('./review_data');
    }

    const timestamp = new Date().toISOString().replace(/[:T\-Z\.]/g, '_');
    const filename = `reviews_all_details_${asin}_all_critical_${timestamp}.json`;
    const filePath = `./review_data/${filename}`;
    const rawReviewsFilename = `raw_reviews_${asin}_${timestamp}.html`;
    const rawProductDetailsFilename = `raw_product_details_${asin}_${timestamp}.html`;
    const rawAodMainProductDetailsFilename = `raw_aod_main_details_${asin}_${timestamp}.html`;
    const rawAodSellerInfoFilename = `raw_aod_seller_info_${asin}_${timestamp}.html`;

    const rawReviewsFilePath = `./review_data/${rawReviewsFilename}`;
    const rawProductDetailsFilePath = `./review_data/${rawProductDetailsFilename}`;
    const rawAodMainProductDetailsFilePath = `./review_data/${rawAodMainProductDetailsFilename}`;
    const rawAodSellerInfoFilePath = `./review_data/${rawAodSellerInfoFilename}`;

    console.log(`[SERVER DEBUG] Saving all data for ASIN ${asin} to ${filePath}. All Reviews Count: ${allReviews.length}, Critical Reviews Count: ${criticalReviews.length}`);
    console.log(`[SERVER DEBUG] Saving raw reviews HTML for ASIN ${asin} to ${rawReviewsFilePath}`);
    console.log(`[SERVER DEBUG] Saving raw product details HTML for ASIN ${asin} to ${rawProductDetailsFilePath}`);
    console.log(`[SERVER DEBUG] Saving raw AOD Main Product Details HTML for ASIN ${asin} to ${rawAodMainProductDetailsFilePath}`);
    console.log(`[SERVER DEBUG] Saving raw AOD Seller Info HTML for ASIN ${asin} to ${rawAodSellerInfoFilePath}`);

    // Write JSON data
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          asin: asin,
          allReviews: allReviews,
          criticalReviews: criticalReviews,
          productDetails: parsedProductDetails,
          aodMainProductDetails: parsedAodMainProductDetails,
          aodSellerInfo: parsedAodSellerInfo
        },
        null,
        2
      )
    );

    // Write raw HTML
    fs.writeFileSync(rawReviewsFilePath, reviewHtml);
    fs.writeFileSync(rawProductDetailsFilePath, productDetailsHtml);
    fs.writeFileSync(rawAodMainProductDetailsFilePath, aodMainProductDetailsHtml);
    fs.writeFileSync(rawAodSellerInfoFilePath, aodSellerInfoHtml);

    console.log(`[SERVER DEBUG] Successfully saved all data for ASIN ${asin} to ${filePath}`);

    // UPDATE PROGRESS: if this matches the current in-progress ASIN, we consider it "completed"
    if (progress.currentAsin === asin) {
      progress.completed++;
      progress.step = 'done';
      console.log(`[SERVER DEBUG] Marked ASIN ${asin} as completed. (Completed: ${progress.completed}/${progress.total})`);
    }

    res.json({
      message: `All data for ASIN ${asin} saved successfully to ${filename}`,
      filename: filename,
      rawReviewsFilename: rawReviewsFilename,
      rawProductDetailsFilename: rawProductDetailsFilename,
      rawAodMainProductDetailsFilename: rawAodMainProductDetailsFilename,
      rawAodSellerInfoFilename: rawAodSellerInfoFilename
    });

  } catch (error) {
    console.error("[SERVER DEBUG] Error saving data to file:", error);
    res.status(500).json({ error: 'Error saving data to file.' });
  }
});

/*********************************************************************
 * 5. PARSING FUNCTIONS (unchanged from original)
 *********************************************************************/
// ... (parsing functions - no changes) ...
function parseProductDetailsHtml(html) {
  console.log(`[SERVER DEBUG] START parseProductDetailsHtml`);
  const $ = cheerio.load(html);
  const productDetails = {};

  Object.assign(productDetails, parseAsinAndTitle($, html));
  Object.assign(productDetails, parseFeatureBullets($, html));
  Object.assign(productDetails, parseAllOffers($, html));
  Object.assign(productDetails, parseBoughtCountAndPeriod($, html));
  Object.assign(productDetails, parseBrandInsights($, html));
  Object.assign(productDetails, parseBuyboxInfo($, html));
  Object.assign(productDetails, parseCategoryInfo($, html));
  Object.assign(productDetails, parseOtherSellersOverview($, html));
  Object.assign(productDetails, parseOverviewBrand($, html));
  Object.assign(productDetails, parseTechnicalDetails($, html));
  Object.assign(productDetails, parseWhatsInBox($, html));
  Object.assign(productDetails, parseProductDetailsExpanded($, html));
  Object.assign(productDetails, parseAodMainProductDetailsHtml(html));
  Object.assign(productDetails, parseAodSellerInfoHtml(html));

  console.log(`[SERVER DEBUG] END parseProductDetailsHtml`);
  return productDetails;
}

function parseAsinAndTitle($, html) {
  const productInfo = {};
  const productTitleElement = $('#productTitle');
  productInfo.productTitle = productTitleElement.text().trim() || null;
  let asin = null;

  const asinElement = $('[data-asin], [data-csa-c-asin]');
  if (asinElement.length) {
    asin = asinElement.data('asin') || asinElement.data('csa-c-asin');
  }

  if (!asin) {
    const scripts = $('script');
    scripts.each((i, script) => {
      const asinMatch = $(script).text().match(/"asin"\s*:\s*"([A-Z0-9]+)"/);
      if (asinMatch && asinMatch[1]) {
        asin = asinMatch[1];
        return false;
      }
    });
  }
  productInfo.asin = asin;
  return productInfo;
}

function parseFeatureBullets($, html) {
  const featureData = {};
  const featureBulletsDiv = $('#featurebullets_feature_div');
  const features = [];
  let aboutThisItemText = null;

  if (featureBulletsDiv.length) {
    const heading = featureBulletsDiv.find('h2.a-size-base-plus.a-text-bold');
    if (heading.length) {
      aboutThisItemText = heading.text().trim();
    }
    const listItems = featureBulletsDiv.find('ul.a-unordered-list li.a-spacing-mini span.a-list-item');
    listItems.each((i, item) => {
      const featureText = $(item).text().trim();
      const cleanedFeatureText = featureText.replace(/\s+/g, ' ').replace(/\*+/g, '*').trim();
      features.push(cleanedFeatureText);
    });
  }
  featureData.aboutThisItemText = aboutThisItemText;
  featureData.featureBullets = features;
  return featureData;
}

function parseAllOffers($, html) {
  const offersData = {};
  return offersData;
}

function parseBoughtCountAndPeriod($, html) {
  const boughtData = {};
  const faceoutDiv = $('#socialProofingAsinFaceout_feature_div');
  let boughtCount = null;
  let boughtPeriod = null;

  if (faceoutDiv.length) {
    const titleSpan = faceoutDiv.find('#social-proofing-faceout-title-tk_bought .a-text-bold');
    const periodSpan = faceoutDiv.find('#social-proofing-faceout-title-tk_bought span:not(.a-text-bold)');
    if (titleSpan.length) {
      boughtCount = titleSpan.text().trim().match(/^\d+(?:\.\d+)?K?\+?/)?.[0] || null;
    }
    if (periodSpan.length) {
      boughtPeriod = periodSpan.text().trim() || null;
    }
  }
  boughtData.boughtCount = boughtCount;
  boughtData.boughtPeriod = boughtPeriod;
  return boughtData;
}

function parseBrandInsights($, html) {
  const brandInsightsData = {};
  const brandInsightsDiv = $('#brandInsights_feature_div_3');
  const brandInsights = {};

  if (brandInsightsDiv.length) {
    const heading = brandInsightsDiv.find('h2.a-size-medium.a-spacing-small');
    if (heading.length) {
      brandInsights.topBrand = heading.text().trim();
    }
    const insightBoxes = brandInsightsDiv.find('.a-column .a-box.a-color-alternate-background');
    insightBoxes.each((index, box) => {
      const titleElement = $(box).find('.a-text-bold');
      const descriptionElement = $(box).find('.a-row:nth-child(2) .a-size-small');
      if (titleElement.length && descriptionElement.length) {
        const title = titleElement.text().trim();
        const description = descriptionElement.text().trim();
        let key = title.toLowerCase().replace(/\s+/g, '_');
        if (key) {
          brandInsights[key] = description;
        }
      }
    });
  }
  brandInsightsData.brandInsights = brandInsights;
  return brandInsightsData;
}

function parseBuyboxInfo($, html) {
  const buyboxData = {};
  const desktopBuyboxDiv = $('#desktop_buybox');

  if (desktopBuyboxDiv.length) {
    const buyNewPriceElement = desktopBuyboxDiv.find('#newAccordionRow_0 .a-price .a-offscreen');
    buyboxData.buyNewPrice = buyNewPriceElement.text().trim() || null;

    const buyNewAvailabilityElement = desktopBuyboxDiv.find('#newAccordionRow_0 #availability span');
    buyboxData.buyNewAvailability = buyNewAvailabilityElement.text().trim() || null;

    const buyUsedPriceElement = desktopBuyboxDiv.find('#usedAccordionRow .a-price .a-offscreen');
    buyboxData.buyUsedPrice = buyUsedPriceElement.text().trim() || null;

    const buyUsedAvailabilityElement = desktopBuyboxDiv.find('#usedAccordionRow #availability span');
    buyboxData.buyUsedAvailability = buyUsedAvailabilityElement.text().trim() || null;

    const shipsFromNewElement = desktopBuyboxDiv.find('#newAccordionRow_0 #sfsb_accordion_head .a-row:nth-child(1) .truncate .a-size-small:nth-child(2)');
    buyboxData.shipsFromNew = shipsFromNewElement.text().trim() || null;

    const soldByNewElement = desktopBuyboxDiv.find('#newAccordionRow_0 #sfsb_accordion_head .a-row:nth-child(2) .truncate .a-size-small:nth-child(2)');
    buyboxData.soldByNew = soldByNewElement.text().trim() || null;

    const shipsFromUsedElement = desktopBuyboxDiv.find('#usedAccordionRow #sfsb_accordion_head .a-row:nth-child(1) .truncate .a-size-small:nth-child(2)');
    buyboxData.shipsFromUsed = shipsFromUsedElement.text().trim() || null;

    const soldByUsedElement = desktopBuyboxDiv.find('#usedAccordionRow #sfsb_accordion_head .a-row:nth-child(2) .truncate .a-size-small:nth-child(2)');
    buyboxData.soldByUsed = soldByUsedElement.text().trim() || null;

    const quantityElement = desktopBuyboxDiv.find('#selectQuantity select#quantity');
    buyboxData.quantityAvailable = quantityElement.length
      ? Array.from(quantityElement.find('option')).map(option => $(option).attr('value'))
      : null;
  }
  return buyboxData;
}

function parseCategoryInfo($, html) {
  const categoryData = {};
  const navSubnavDiv = $('#nav-subnav');
  const subnavData = {
    category: null,
    subcategories: [],
    mainCategory: null
  };

  if (navSubnavDiv.length) {
    subnavData.category = navSubnavDiv.data('category')?.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) || null;

    navSubnavDiv.find('a.nav-a:not(.nav-b)').each((index, link) => {
      const subcategoryText = $(link).find('.nav-a-content').text().trim();
      if (subcategoryText) {
        subnavData.subcategories.push(subcategoryText);
      }
    });
    subnavData.mainCategory = navSubnavDiv.find('a.nav-a.nav-b .nav-a-content').text().trim() || null;
  }
  categoryData.subnavData = subnavData;
  return categoryData;
}

function parseOtherSellersOverview($, html) {
  const otherSellersData = {};
  const otherSellersDiv = $('#dynamic-aod-ingress-box');
  if (otherSellersDiv.length > 0) {
    const heading = otherSellersDiv.find('.daodi-header-font');
    if (heading.length) {
      otherSellersData.heading = heading.text().trim() || null;
    }
    const linkElement = otherSellersDiv.find('#aod-ingress-link');
    if (linkElement.length) {
      const offersText = linkElement.find('.a-color-base:first-of-type');
      const priceElement = linkElement.find('.a-price .a-offscreen');
      if (offersText.length) {
        const match = offersText.text().trim().match(/New & Used \((\d+)\) from/);
        if (match) {
          otherSellersData.numOffers = parseInt(match[1], 10);
        }
      }
      if (priceElement.length) {
        otherSellersData.startingPrice = priceElement.text().trim() || null;
      }
      otherSellersData.url = linkElement.attr('href') || null;
      otherSellersData.freeShipping = linkElement.find('b').text().trim() || null;
    }
  }
  return otherSellersData;
}

function parseOverviewBrand($, html) {
  const overviewBrandData = {};
  const productOverviewDiv = $('#productOverview_feature_div');
  const productDetails = {};

  if (productOverviewDiv.length) {
    const rows = productOverviewDiv.find('table tr');
    rows.each((index, row) => {
      const attributeNameElement = $(row).find('td.a-span3 .a-text-bold');
      const attributeValueElement = $(row).find('td.a-span9 .po-break-word');
      if (attributeNameElement.length && attributeValueElement.length) {
        let attributeName = attributeNameElement.text().trim();
        const attributeValue = attributeValueElement.text().trim();
        attributeName = attributeName
          .replace(/\s+/g, ' ')
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .trim()
          .toLowerCase()
          .split(' ')
          .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
          .join('');
        productDetails[attributeName] = attributeValue;
      }
    });
    const scriptOverview = productOverviewDiv.find('script[type="text/javascript"]');
    let overviewAsin = null;
    let overviewProductType = null;
    if (scriptOverview.length) {
      const asinMatch = scriptOverview.text().match(/metricParameters\.asin = '([^']+)';/);
      const productTypeMatch = scriptOverview.text().match(/metricParameters\.productType = '([^']+)';/);
      overviewAsin = asinMatch ? asinMatch[1] : null;
      overviewProductType = productTypeMatch ? productTypeMatch[1] : null;
    }
    overviewBrandData.productDetails = productDetails;
    overviewBrandData.overviewAsin = overviewAsin;
    overviewBrandData.overviewProductType = overviewProductType;
  }
  return overviewBrandData;
}

function parseTechnicalDetails($, html) {
  const technicalDetailsData = {};
  const techDiv = $('#tech');
  const technicalDetails = {};

  if (techDiv.length) {
    technicalDetails.heading = techDiv.find('h2').text().trim() || null;
    technicalDetails.ancText = techDiv.find('.content-grid-block p').text().trim() || null;

    const tables = techDiv.find('table.a-bordered');
    tables.each((tableIndex, table) => {
      const tableData = {};
      $(table).find('tr').each((index, row) => {
        const headerCell = $(row).find('td:first-child p strong');
        const dataCell = $(row).find('td:nth-child(2)');
        if (headerCell.length && dataCell.length) {
          let headerText = headerCell.text().trim();
          headerText = headerText
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '')
            .toLowerCase();
          let dataText = dataCell.html().trim();
          tableData[`table_${tableIndex + 1}_${headerText}`] = dataText;
        }
      });
      technicalDetails[`table_${tableIndex + 1}`] = tableData;
    });
  }
  technicalDetailsData.technicalDetails = technicalDetails;
  return technicalDetailsData;
}

function parseWhatsInBox($, html) {
  const whatsInBoxData = {};
  const whatsInTheBoxDiv = $('#postPurchaseWhatsInTheBox_MP_feature_div');
  const whatsInTheBox = {};

  if (whatsInTheBoxDiv.length) {
    whatsInTheBox.heading = whatsInTheBoxDiv.find('h2').text().trim() || null;
    const items = [];
    whatsInTheBoxDiv
      .find('#witb-content-list li.postpurchase-included-components-list-item span.a-list-item')
      .each((index, item) => {
        items.push($(item).text().trim());
      });
    whatsInTheBox.items = items;
  }
  whatsInBoxData.whatsInTheBox = whatsInTheBox;
  return whatsInBoxData;
}

function parseProductDetailsExpanded($, html) {
  const productDetailsExpandedData = {};
  const productDetailsDiv = $('#productDetails_feature_div');
  const productDetails = {};

  if (productDetailsDiv.length) {
    productDetails.heading = productDetailsDiv.find('h1.a-text-bold').text().trim() || null;
    const expanderSections = productDetailsDiv.find('.a-expander-container');
    expanderSections.each((sectionIndex, section) => {
      const sectionTitleElement = $(section).find('.a-expander-prompt');
      const table = $(section).find('table.prodDetTable');
      if (sectionTitleElement.length && table.length) {
        let sectionTitle = sectionTitleElement.text().trim();
        sectionTitle = sectionTitle
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_]/g, '')
          .toLowerCase();
        const tableData = {};
        $(table).find('tr').each((rowIndex, row) => {
          const headerCell = $(row).find('th.prodDetSectionEntry');
          const dataCell = $(row).find('td.prodDetAttrValue');
          if (headerCell.length && dataCell.length) {
            let headerText = headerCell.text().trim();
            headerText = headerText
              .replace(/\s+/g, '_')
              .replace(/[^a-zA-Z0-9_]/g, '')
              .toLowerCase();
            const dataText = dataCell.text().trim();
            tableData[`section_${sectionIndex + 1}_row_${rowIndex + 1}_${headerText}`] = dataText;
          }
        });
        productDetails[`${sectionTitle}`] = tableData;
      }
    });

    const warrantySection = productDetailsDiv.find('#productSpecifications_dp_warranty_and_support');
    if (warrantySection.length) {
      const warrantyHeading = warrantySection.find('h3');
      const warrantyText = warrantySection.find('.table-padding');
      if (warrantyHeading.length && warrantyText.length) {
        productDetails.warranty = {
          heading: warrantyHeading.text().trim(),
          text: warrantyText.text().trim()
        };
      }
    }
  }
  productDetailsExpandedData.productDetails = productDetails;
  return productDetailsExpandedData;
}

function parseAodMainProductDetailsHtml(html) {
  console.log(`[SERVER DEBUG] START parseAodMainProductDetailsHtml`);
  const $ = cheerio.load(html);
  const aodMainProductDetails = {};
  const pinnedOfferElement = $('#aod-sticky-pinned-offer');

  if (pinnedOfferElement.length > 0) {
    aodMainProductDetails.productName = pinnedOfferElement.find('#aod-asin-title-text').text().trim() || 'N/A';
    aodMainProductDetails.productImageURL = pinnedOfferElement.find('#pinned-image-id img').attr('src') || 'N/A';

    const ratingStarElement = pinnedOfferElement.find('#aod-asin-reviews-star i.a-icon-star');
    if (ratingStarElement.length > 0) {
      aodMainProductDetails.starRating = ratingStarElement.find('.a-icon-alt').text().trim() || 'N/A';
    }

    const ratingCountElement = pinnedOfferElement.find('#aod-asin-reviews-block span.a-size-small');
    aodMainProductDetails.ratingCount = ratingCountElement.text().trim().split(' ratings')[0] || 'N/A';
    aodMainProductDetails.currentPrice = pinnedOfferElement.find('#aod-price-0 .a-price.centralizedApexPricePriceToPayMargin').text().trim() || 'N/A';
    aodMainProductDetails.listPrice = pinnedOfferElement.find('#aod-price-0 .a-text-price[data-a-strike="true"]').text().trim() || 'N/A';
    aodMainProductDetails.savingsPercentage = pinnedOfferElement.find('#aod-price-0 .apex-savings-badge .apex-savings-text').text().trim() || 'N/A';
    aodMainProductDetails.standardDeliveryDate = pinnedOfferElement.find('#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE .a-text-bold').text().trim() || 'N/A';
    aodMainProductDetails.primeDeliveryDate = pinnedOfferElement.find('#mir-layout-DELIVERY_BLOCK-slot-SECONDARY_DELIVERY_MESSAGE_LARGE .a-text-bold').text().trim() || 'N/A';
    aodMainProductDetails.sellerName = "Amazon.com"; // pinned offer is typically Amazon
  }
  console.log(`[SERVER DEBUG] END parseAodMainProductDetailsHtml`);
  return aodMainProductDetails;
}

function parseAodSellerInfoHtml(html) {
  console.log(`[SERVER DEBUG] START parseAodSellerInfoHtml`);
  const $ = cheerio.load(html);
  const aodSellerInfo = { offers: [] };
  const offerList = $('#aod-offer-list #aod-offer');

  if (offerList.length > 0) {
    offerList.each((index, offerElement) => {
      const offerData = {};
      offerData.condition = $(offerElement).find('.aod-offer-heading .a-text-bold').text().trim() || 'N/A';
      let sellerNameElement = $(offerElement).find('#aod-offer-soldBy a.a-link-normal');
      if (!sellerNameElement.length) {
        sellerNameElement = $(offerElement).find('#aod-offer-soldBy span.a-size-small.a-color-base');
      }
      offerData.sellerName = sellerNameElement.text().trim() ||
        (offerData.condition === 'New' && index === 0 ? "Amazon.com" : 'N/A');
      offerData.price = $(offerElement).find('#aod-offer-price .a-price').text().trim() || 'N/A';

      const ratingStarElement = $(offerElement).find('#aod-offer-seller-rating i.a-icon-star-mini');
      offerData.rating = ratingStarElement
        .attr('class')
        ?.split('a-star-mini-')[1]
        ?.replace(/-/g, '.')
        || 'N/A';

      const ratingCountElement = $(offerElement).find('#aod-offer-seller-rating span.a-size-small span:last-child');
      offerData.ratingCount = ratingCountElement.text().trim().replace(/[\(\)]/g, '').split(' ratings')[0] || 'N/A';

      offerData.shipsFrom = $(offerElement).find('#aod-offer-shipsFrom .a-size-small.a-color-base').text().trim() || 'N/A';
      offerData.customerService = $(offerElement).find('#aod-offer-customerServiceIdentifier .a-size-small.a-color-base').text().trim() || 'N/A';

      aodSellerInfo.offers.push(offerData);
    });
  }
  console.log(`[SERVER DEBUG] END parseAodSellerInfoHtml`);
  return aodSellerInfo;
}


/*********************************************************************
 * 6. START SERVER
 *********************************************************************/
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});