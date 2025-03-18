// content_features.js

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getEmptyFeatures()
{
    return {
        aboutThisItemText: null,
        features: []
    };
}

// Fetches ONLY feature bullets and "About this item" via AJAX
async function scrapeFeatures(asin) {
  const productURL = `https://www.amazon.com/dp/${asin}/`;
 try {

  const response = await fetch(productURL);

    if (!response.ok) { //check fetch fail for Asin

     console.error(`Failed to fetch product page. Status: ${response.status} URL: ${productURL}`);
    // Return directly, avoiding the throw for a specific 404
     if (response.status == 404) //empty do no longer fetch! just return to process to get result and asin(do not fail just pass no feature available.
     {

 return getEmptyFeatures(); //important. //avoid thow for the 404

     }
 throw new Error(`Failed to fetch product page. Status: ${response.status}`); //send error and stops main thread;
        }

  const html = await response.text();  //if the ASIN available then get whole data from current result to keep ASIN.

    const parser = new DOMParser();  // Dom parse for parsing;

   const doc = parser.parseFromString(html, 'text/html'); //html text parse here now.

    const featureBulletsDiv = doc.getElementById('feature-bullets'); //feature-bullets important when asin return result for avoiding unexpected case just add first null

 //Get default:
     let aboutThisItemText = null;
 const features = [];

        if (featureBulletsDiv) {

            const heading = featureBulletsDiv.querySelector('h1.a-size-base-plus.a-text-bold');
         if (heading) {

              aboutThisItemText = heading.textContent.trim();

         }

        const listItems = featureBulletsDiv.querySelectorAll('ul.a-unordered-list.a-vertical.a-spacing-mini > li span.a-list-item');

 listItems.forEach(item => { //find items

   const featureText = item.textContent.trim();  //iterate whole

  const cleanedFeatureText = featureText.replace(/\s+/g, ' ').replace(/\*+/g, '*').trim();

    features.push(cleanedFeatureText);  //send feature value; add this to result to

          });

     }

  return { aboutThisItemText, features};
} catch (error) {

       console.error("Error fetching or parsing product page:", error);

	  return getEmptyFeatures();


    }

}

// Listener: we listen in this, if no data found; returns and continue for next items:
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
     if (request.action === "processAsinForFeature") { //message received for feature;
         scrapeFeatures(request.asin).then(featuresData=> { //return data to background after sending this; keep

        chrome.runtime.sendMessage({ action: "featureData", data: featuresData, asin: request.asin }); //return now;

       }).catch(error=>{
           console.log("Feature returned empty. Check errors",error) //keep this
              chrome.runtime.sendMessage({action: 'featureData', data:getEmptyFeatures(),asin:request.asin}) //return; we sent, let continue no block main thread.
           });

    }
});