// COMPLETE background.js (with detailed comments and explanations)

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getEmptyFeatures() {
    return { //helps creating return result if no features and others exists(asin is correct).
        aboutThisItemText: null,
        features: [],
        boughtCount: null,
        boughtPeriod: null,
        productDetails: {},
        techDetails: {},
        whatsInTheBox: {},
        otherSellersData: {}
    };
}

function getEmptyReviews() {
    return { reviews: [], reviewCount: 0, reviewAvgRating: null };
}

async function scrapeReviews(asin) {
    let reviews = [];
    let reviewCount = 0;
    let reviewAvgRating = null;
	let reviewInfo = null;

    // Helper function
    // Inside background.js

async function scrapeReviewType(reviewType) {
    // 1.  Start with the base product review URL, ALWAYS:
    let baseUrl = `https://www.amazon.com/product-reviews/${asin}?ie=UTF8&reviewerType=all_reviews`;

    // 2.  Add the filterByStar parameter ONLY for critical reviews:
    if (reviewType === 'critical') {
        baseUrl += '&filterByStar=critical';
    }

    //----Rest Code Block is same--- therefore no need additional implementation required---

	const tabId = (await chrome.tabs.create({ url: baseUrl, active: false })).id;

    let reviewInfo = await new Promise(resolve => { //reviews here, then; returns; await new; from content message when review ok
    const listener = (request, sender) => { //listen
    if(sender.tab && sender.tab.id === tabId){ //send messages asin also

           if (request.action === "reviewData") {  //from; asin

          chrome.runtime.onMessage.removeListener(listener);  //prevent duplicate reviews.

              resolve(request.data); //resolve await with that tab result.(content always wait response here)
              } //value to wait:
                //reviews ok; add new, then process! avoid too many tabs... review message.

        }

   }; //tab created for review parts as.

      chrome.runtime.onMessage.addListener(listener);

chrome.scripting.executeScript({  //content details as page; but... features! for main features(main context); then! content: for asin; with asin; with details page; tab fetch as result(promise resolved; as wait-operation); no need.

 target: { tabId: tabId },
     files: ['content_reviews.js']
      }, () => {

      chrome.tabs.sendMessage(tabId, { action: "getReviews", asin: asin, reviewType: reviewType });  //review page tab also closed.

  });
      });

 chrome.tabs.remove(tabId); //this always set; when review ok; other catch, stops(therefore important).

   if (!reviewInfo) { //when any empty no-features do nothing
        reviewInfo = getEmptyReviews(); //this returns
        }

     return reviewInfo;  //after return value.
} // End

       //Call type; with promise: no wait; just call.
     const reviewsNormal =   await scrapeReviewType('normal');  //no logic needed to implement, that content fetch operation made

     const reviewsCritical = await scrapeReviewType('critical');

       reviews = [...reviewsNormal.reviews, ...reviewsCritical.reviews];
    //return values... we merge as whole; count always greater: 10 ,... 5 reviews would return 15; we only have main counter; not types... critical counts etc.. we could filter with them;

     // Get max from normal and critical as count would return either(empty result) with different; normal should contain reviews in almost cases.
    reviewCount = (reviewsNormal.reviewCount > reviewsCritical.reviewCount ? reviewsNormal.reviewCount:reviewsCritical.reviewCount);
   reviewAvgRating = (reviewsNormal.reviewAvgRating != null ? reviewsNormal.reviewAvgRating : reviewsCritical.reviewAvgRating) ;

     return { reviews, reviewCount, reviewAvgRating }; //here; all set with data... now review info completed!. we use it again.

 }


let scrapedData = {}; // The main data store for the current run
let processing = false;  // Is the scraper currently processing ASINs?
let paused = false;      // Is the scraper paused?
let stopped = false;  // Complete state of app.
const GITHUB_TOKEN = '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';  // YOUR GITHUB TOKEN
const GITHUB_REPO = 'https://api.github.com/repos/wk23aau/amazon-scraper-extension/contents/data/raw/';


// Save state
async function saveState() {
    await chrome.storage.local.set({ scrapedData, processing, paused, stopped });
}

// Load state
async function loadState() {
    const data = await chrome.storage.local.get(['scrapedData', 'processing', 'paused','stopped']);
    if (data.scrapedData) scrapedData = data.scrapedData; //get result; asin queue is set if already sets, this object includes also status to avoiding re-executing same Asins.
    if (data.processing !== undefined) processing = data.processing;
    if (data.paused !== undefined) paused = data.paused;
	if(data.stopped !== undefined) stopped = data.stopped;  // Handle undefined state
}



// Utility to send messages
async function sendMessageToContentScript(message) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });  //only when content pages, no background.
    if (tab && tab.id) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (message) => {
                   window.postMessage(message, '*'); //content message

                },
                args: [message] //arguments that sent to scripts
            });
        } catch (error) {
            console.error("Error sending message to content script:", error);
        }
    }
}



// Upload to GitHub
async function uploadToGitHub(filename, content) { //file to save.
    const base64Content = btoa(unescape(encodeURIComponent(JSON.stringify(content)))); //to avoid chars, decode to send
    const url = `${GITHUB_REPO}${filename}`;  //base url.

    try { //github operations; PUT method as it requires
        const response = await fetch(url, {  //Fetch call for sending ASIN data with timestamps
            method: 'PUT', //method important PUT
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,  //Github Auth
                'Content-Type': 'application/json', //json data send;
            },
            body: JSON.stringify({ //body is in json format(always json; otherwise request ignored or get 500,403 errors.)
                message: `Add ${filename}`,  //message that send also with content to upload;
                content: base64Content,  //important bto...
            }), //stringify body end
        });

        if (!response.ok) { //check the operation(response, fetch completed however 200)
			//
            const errorData = await response.json();
			console.error("GitHub API Error:", errorData);

            throw new Error(`GitHub upload failed: ${response.status} - ${response.statusText}`); //breaks!
        }
        console.log('Uploaded to GitHub:', filename);
		await sendMessageToContentScript({ action: 'progress', message: `Uploaded: ${filename}` });

    } catch (error) {  //Any unexpection catch to console the whole
        console.error('Error uploading to GitHub:', error);
        await sendMessageToContentScript({ action: 'progress', message: `Failed Upload: ${filename} Reason:${error.message}` });

    }
}


// Central ASIN Processing Function
async function processASIN(asin) {
    if (stopped) return;  // Stop if stopped
    if (paused) {
        await saveState();
       return; // Stop when paused.
    }

    //Start process to collect ASIN main fetch request; which would
    await sendMessageToContentScript({ action: 'progress', message: `Scraping Features for: ${asin}` });
    let featureInfo = {};

	try {
      // ---- Step 1: Initial Feature Fetch (AJAX) ----
      let featureInfoPromise =  new Promise((resolve)=>{
          const listener = (request,sender) => { //content Feature page result

               if(request.action === 'featureData' && request.asin == asin){ //check for async request(send before request, now check result )

                 chrome.runtime.onMessage.removeListener(listener);
                  resolve(request.data)
               }
          };
           chrome.runtime.onMessage.addListener(listener);
         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                     const activeTabId = tabs[0].id;
              chrome.scripting.executeScript({

                   target: { tabId: activeTabId }, //target correct id

                   files: ['content_features.js']  //context

                 }, () => {

                      chrome.tabs.sendMessage(activeTabId,{ action: "processAsinForFeature", asin: asin });

              }); //correct file; after data

          } //main active asin content page to be fetch!
       });

      });

    featureInfo  =  await featureInfoPromise; //we completed to await message came(to continue work here!) features
    // --- STEP -2 Review Fetch
   await sendMessageToContentScript({ action: 'progress', message: `Scraping Reviews for: ${asin}` });

     let reviewInfo = await scrapeReviews(asin); //we collect all features from the current reviews(normal or critical).
 if (!scrapedData[asin]) {
    scrapedData[asin] = {};  //if scrape error returns for any other asin then, ensure it will returns always empty also to make application safe; if feature also missed just
       }

 Object.assign(scrapedData[asin], featureInfo, reviewInfo);

  const needsDetailFetch = Object.values(scrapedData[asin]).some(value => {
         if (value === null || value === '' || value === 0) {

            return true;
        }
             if (Array.isArray(value) && value.length === 0) {
                 return true; //we consider
               }

            if(typeof value == "object" && Object.keys(value).length ==0){
            return true; //feature value

                }
                 return false;

  });

  if (needsDetailFetch) {
   await sendMessageToContentScript({ action: 'progress', message: `Fetching details for: ${asin}` }); //progress message update

  const tabId = (await chrome.tabs.create({ url: `https://www.amazon.com/dp/${asin}`, active: false })).id; //use create a tab to navigate in background fetch, it resolves after page loading

   //Wait tab operation completed to send/retrieve; this avoid sending result very early
    let detailFeaturePromise =  new Promise((resolve)=>{  //create promise object; and use content page as ASYNC to wait for promise, we got main page
    const listener = (request,sender) => { //tab listen now on asin; asin based message now:

       if(request.action === 'detailFeatureData' && request.asin == asin){ //when feature message and for asin came.

          chrome.runtime.onMessage.removeListener(listener);

           resolve(request.data) //now we good to resolve asin

             }
           };
            chrome.runtime.onMessage.addListener(listener); //tab created now use. //
         chrome.scripting.executeScript({  //details!

           target: { tabId: tabId },

             files: ['content_detail.js'] //now fetch asin, target fetch

          }, () => {

         chrome.tabs.sendMessage(tabId,{ action: "fillMissingFeatures", asin: asin }); // asin important value
             });
       }); //close the promise to be completed for await to move asin.
        const detailFeatureInfo  = await detailFeaturePromise;

      Object.assign(scrapedData[asin], detailFeatureInfo);

          chrome.tabs.remove(tabId);
 }
     scrapedData[asin].status = "completed";
     const timestamp = new Date().toLocaleString().replace(/[/\\:]/g, "-"); //time value and prevent error character.

      const filename = `${asin}-${timestamp}.json`;
      await uploadToGitHub(filename, scrapedData[asin]);

     await saveState(); //important; to save features/asin/completed; for example if we skip that case.

     } catch (error) { // asin

         console.error(`Error processing ASIN ${asin}:`, error);
   if (!scrapedData[asin]) {
    scrapedData[asin] = {};
       }

     scrapedData[asin].status = 'failed'; //when any reason from ASIN process throw exception.

          await saveState();

        }

    }



   async function mainProcessLoop() { //to keep progress in memory when discard operation happens it would stop.

    await loadState();

     if(!scrapedData.asinsToProcess){
       return;
      }

       processing = true;

    //
 while (scrapedData.asinsToProcess && scrapedData.asinsToProcess.length > 0 && !stopped) {

        if (!paused) { //paused;
            const asin = scrapedData.asinsToProcess.shift();

 if(scrapedData[asin] && scrapedData[asin].status === 'completed') {  //persist to

         continue; //go asin list(on completed items we always prevent.!)
   }
         await processASIN(asin);

      }
         else{
             break;

        }
  }

      if (scrapedData.asinsToProcess.length == 0 ) {
     processing = false;
      stopped = true;
   }

      await saveState(); //safe

  }
 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action === "getAsins") { //message from current Asin tab(that in Amazon)
   if (!scrapedData.asinsToProcess) {
         scrapedData.asinsToProcess = []; //
         }

           const newAsins = request.asins.filter(asin => !scrapedData.asinsToProcess.includes(asin));

         scrapedData.asinsToProcess.push(...newAsins);

          saveState(); //safe to avoids others
          }
        else if (request.action === "start") { //we always use, chrome operations; do no try; background operation can use; also use "currentWindow, to only trigger fetch() asin features; on active tabs") to send content page fetch/

       stopped = false;
    paused = false;
     processing = true; //keep running

       if(!scrapedData.asinsToProcess || scrapedData.asinsToProcess.length ==0)

            {

              console.log("No asin to process"); //empty list then keep away...
              return;
           }

 mainProcessLoop();

}
 else if (request.action === "pause") { //asin, stopped! no current window thing(pause), only do background operations(it stops ASIN ) fetch data(new asin requests!) no main-thread works, and we just go back...

    paused = true; //stop flag only(do not stuck queue)
    processing = false; //no do flag, prevent!
    saveState(); //
  console.log("paused called....")

        } else if (request.action === "resume") {
      paused = false; //set off for new loop if we

  stopped = false; //important here; new message send the loop(stopped also)

      processing = true; //we need also set to
 mainProcessLoop();
    }

     else if(request.action === "stop") {
       stopped = true; //prevent stopped case in main ASIN; it will handle in the first asin process also.
       processing = false;  // Important to
      paused = false;  //reset it!
       saveState(); //no save anything.
       }

     else if (request.action === "discard") {

     scrapedData = {}; //Cleaned data memory(from current memory value: let, or others, never const: let);. to store and return with any results.

         processing = false;
          paused = false;
         stopped = false;  // Prevent going loop again... when discarded all set(clean/fresh operations begins, when all set flag to default)


    chrome.storage.local.clear();
         } else if (request.action === "checkState") { //keeps checks for pause: resume operations(checks tab button status from) we get result

   sendResponse({

  processing: processing, //returns
         paused: paused,
         stopped: stopped

 });

       }
    });

  chrome.runtime.onStartup.addListener(() => {
    loadState();  // Load
 });