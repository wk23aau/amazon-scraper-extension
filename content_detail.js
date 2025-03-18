//content_detail.js
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function scrapeFeatures(asin) {
  
      const productURL = `https://www.amazon.com/dp/${asin}/`; //asin always available here therefore safe.
  
        try {
  
       const response = await fetch(productURL);  //
  
          if (!response.ok) {
              //check status for fetch errors: to log.
   console.error(`Failed to fetch product page. Status: ${response.status} URL: ${productURL}`);
  
            if(response.status === 404){  //only no 404 data
             return getEmptyFeatures();
        }
  
         throw new Error(`Failed to fetch product page. Status: ${response.status}`);
  
          }
    const html = await response.text();
  
              const parser = new DOMParser(); //keep parse
  
             const doc = parser.parseFromString(html, 'text/html'); //text returns by; parser parse
      return extractAllFeatures(doc);  // Extracts ALL data from
  
           } catch (error) {  //error.
               console.error("Error fetching or parsing product page:", error);
     return getEmptyFeatures();  // Returns well-formed, all-null data
  
       }
  }
  
  // New function: Extracts ALL possible info from a parsed product page.
  function extractAllFeatures(doc) {
  
   const featureBulletsDiv = doc.getElementById('feature-bullets');
  
    let aboutThisItemText = null;
      const features = [];
  
      if (featureBulletsDiv) { //
           const heading = featureBulletsDiv.querySelector('h1.a-size-base-plus.a-text-bold');
  
        if (heading) { //h
  
        aboutThisItemText = heading.textContent.trim(); //gets first title for details information if empty would just get title:null!
  
       }
  
     const listItems = featureBulletsDiv.querySelectorAll('ul.a-unordered-list.a-vertical.a-spacing-mini > li span.a-list-item'); // Corrected selector
     listItems.forEach(item => {
     const text = item.textContent.trim();  //trim text important, we may always trim data(even if error-check we use with ! and value for all
       features.push(text);  //text; add it
  
    });
  
      } //
  
        const faceoutDiv = doc.getElementById('socialProofingAsinFaceout_feature_div');
   let boughtCount = null;
         let boughtPeriod = null;
      if (faceoutDiv) {
              //check for title; this returns correct result:
  
             const titleSpan = faceoutDiv.querySelector('.a-text-bold'); //Bold
  
            const periodSpan = faceoutDiv.querySelector('span:not(.a-text-bold)'); //span- check here
      if (titleSpan) { //data keeps now.
  
                  boughtCount = titleSpan.textContent.trim().match(/^\d+(?:\.\d+)?K?\+?/)[0];
     }
  
         if(periodSpan){
  
              boughtPeriod = periodSpan.textContent.trim(); //find data period value.
  
   }
         }
  // Product-details extract! all necessary operations...
  
  
   //
  
   const productDetailsDiv = doc.getElementById('productDetails_feature_div'); //keep detail get value from the document
  
   const productDetails = {};
  
   if (productDetailsDiv) { //avoid-product operation
  
      const heading = productDetailsDiv.querySelector('h1.a-text-bold'); //get now; to use value now:
  
       if (heading) { //returns
        productDetails.heading = heading.textContent.trim(); //first asin-value to return values.
    }
  
   //a-expander-container -> get
      const expanderSections = productDetailsDiv.querySelectorAll('.a-expander-container');
         expanderSections.forEach((section, sectionIndex) => {
       const sectionTitleElement = section.querySelector('.a-expander-prompt'); //we check with values
  
        //
          const table = section.querySelector('table.prodDetTable'); //check
  
          if (sectionTitleElement && table) {
  
      let sectionTitle = sectionTitleElement.textContent.trim();
  
      sectionTitle = sectionTitle.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
              const tableData = {}; //
  
       const rows = table.querySelectorAll('tr');  //find TR inside data result values
  
        rows.forEach(row => {
  
      const headerCell = row.querySelector('th.prodDetSectionEntry'); //find table rows
           const dataCell = row.querySelector('td.prodDetAttrValue');  //
  
            if (headerCell && dataCell) { //keep-data safely here for now
  
              let headerText = headerCell.textContent.trim(); //find, trim text value... avoid all
  
            headerText = headerText.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase(); //cleanup to set
               const dataText = dataCell.textContent.trim();
  
          tableData[headerText] = dataText;  //data keeps values...
  
    }
          });
  
                productDetails[`${sectionTitle}`] = tableData;
          }
  
     });
  
   //---Get details --
           //check for asin value again... //keep result with data.
  
  const warrantySection = productDetailsDiv.querySelector('#productSpecifications_dp_warranty_and_support');
  
       if(warrantySection)
       {
           const warrantyHeading = warrantySection.querySelector('h3');  //heading available also as
          const warrantyText = warrantySection.querySelector('.table-padding');
       if (warrantyHeading && warrantyText)
          {
            productDetails.warranty = {
                heading: warrantyHeading.textContent.trim(),
                     text: warrantyText.textContent.trim() //
            };
  
         }
   }
  
  }
  
       const techDiv = doc.getElementById('tech');  //keeps techincal
  
      if (!techDiv) {
     console.log("Tech details section not found.");
            //removed return;
  
        }
  
       const techDetails = {};
     if (techDiv) {
  
           const headingTech = techDiv.querySelector('h2'); //h2 value is
  
          if (headingTech) { //values to be...
  
        techDetails.heading = headingTech.textContent.trim();
              }
              //check first with "a-tag
        const ancTextElement = techDiv.querySelector('.content-grid-block p'); //check result with data result
         if (ancTextElement) {
         techDetails.ancText = ancTextElement.textContent.trim();
  
     }
  
           //check if values exists for this section.
    const tables = techDiv.querySelectorAll('table.a-bordered');
  
         tables.forEach((table, tableIndex) => {
  
       const tableData = {};
  
           const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
                  //
      const headerCell = row.querySelector('td:first-child p strong'); //values now keep details section
  
    const dataCell = row.querySelector('td:nth-child(2)');
  
       if (headerCell && dataCell) {  //avoid if header or missing return.
           let headerText = headerCell.textContent.trim(); //values; trims value!important;
            //clean value text and return a-values safely(trim it, avoids with unnecessary stuff)
         headerText = headerText.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();  //whitespaces returns.
         let dataText = dataCell.innerHTML.trim();
  
      tableData[headerText] = dataText; //keeps, safe it, set back.
  
     }
        });
  
               techDetails[`table_${tableIndex + 1}`] = tableData;  //safe keep
  
          });
   }
  
  
   //
  
   const whatsInTheBoxDiv = doc.getElementById('postPurchaseWhatsInTheBox_MP_feature_div'); //values, what box! returns;
  
  
      if (!whatsInTheBoxDiv) {
          console.log("What's in the box section not found.");
             //removed return;
  
       }
      const whatsInTheBox = {};
  
          if (whatsInTheBoxDiv) {
  
   const headingBox = whatsInTheBoxDiv.querySelector('h2');
  
           if (headingBox) {
              whatsInTheBox.heading = headingBox.textContent.trim();  //prevent error to returns with default set of this item.
  
         }
              const listItems = whatsInTheBoxDiv.querySelectorAll('#witb-content-list li.postpurchase-included-components-list-item span.a-list-item'); //correct this
               const items = [];
  
       listItems.forEach(item => {  //avoid issues when we use; items push.
              items.push(item.textContent.trim()); //keeps also values if asin result not return safely.
  
       });
  
   whatsInTheBox.items = items; //empty returns if there no data; as string and. we don't check anything from that.
     }
  
          // --- 5. Other Sellers on Amazon ---
  
    const otherSellersDiv = doc.getElementById('dynamic-aod-ingress-box');  //Seller id data information for box keeps also if necessary,
  
            const otherSellersData = {}; //
    if(otherSellersDiv) {  //wrap(keep) returns avoid
  
         const headingOther = otherSellersDiv.querySelector('.daodi-header-font');
  
     if (headingOther) {  //data safely now(data not empty result keep always) therefore better and performance on data usage for object values to be.
        otherSellersData.heading = headingOther.textContent.trim(); //avoid null(trim text trim the result when null also(keeps string not array or something else)! important).
  
        }
       const linkElement = otherSellersDiv.querySelector('#aod-ingress-link');  //values available in a data
  
            if (linkElement) {
  
         const offersText = linkElement.querySelector('.a-color-base:first-of-type'); //find the tag for first elements, when returns now safely values now, returns; to add a message
  
           const priceElement = linkElement.querySelector('.a-price .a-offscreen'); //find value. keep: safely; in fetch operations to parse(and if fetch returns just
           // Continuing from the previous code block in content_detail.js
           if (offersText) {
            // Extract number of offers using regular expression
            const match = offersText.textContent.trim().match(/New & Used \((\d+)\) from/);  //find offers value; correct result with.
            if (match) {
                otherSellersData.numOffers = parseInt(match[1], 10); // Convert to integer avoid to stuck for. and avoid extra result(match returns array); we need number data in array as first value.
            }
        }

        if (priceElement) {
            otherSellersData.startingPrice = priceElement.textContent.trim();  //trim text from empty;
        }
        // --- 3. Get the URL ---
        otherSellersData.url = linkElement.href; //important keep the data!important also values... avoids when asin fetch result if keep errors get: this data with safely
        // --- 4. FREE Shipping ---
        const freeShipping = linkElement.querySelector('b');
        if (freeShipping) { //we
            otherSellersData.freeShipping = freeShipping.textContent.trim(); //important value if free data returns; avoid other errors safely keep also as string!important always returns result as strings: avoid this; to parsing to check data safely and if face values in details fetch safely! avoid and we continue logic: we
       }

    }

  }

return {
    aboutThisItemText,
    features,
    boughtCount,
    boughtPeriod,
    productDetails,
    techDetails,
    whatsInTheBox,
    otherSellersData
};
}

//When missing details returns; this data keeps features value to process.
function getEmptyFeatures() { //value and return; we returns! important keep data on return if returns error safely(in background fetch with Asin) value is keeps always; avoid.

return {
    aboutThisItemText: null,
    features: [], //empty set!important! safely avoids data usage on return
    boughtCount: null,
    boughtPeriod: null,
    productDetails: {}, //keeps! safely in result fetch from product detail pages: if returns, then skip this to handle the current process.
    techDetails: {},
    whatsInTheBox: {},
    otherSellersData: {} //returns. and we keep!safely value on this code
};
}

// Listen for messages from the background script.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

if (request.action === "fillMissingFeatures") {  //if action request(missing features!)

   const asin = request.asin; //keeps: we use the current one; no tab message sending, always! use chrome(tab already defined.

   scrapeFeatures(asin).then(featureData => { //send
         // Send back, asin info also for avoid issues in process ASINs.

        chrome.runtime.sendMessage({ action: "detailFeatureData", data: featureData, asin: asin });
   })
   .catch(error => { //return features if can't do... always; that value
       console.error("Error in scrapeFeatures:", error);

  chrome.runtime.sendMessage({  //when fetch and others fails; always keep that safe operations on return
           action: "detailFeatureData",

           data: getEmptyFeatures(), asin: asin
          });

   });

   }
});