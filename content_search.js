// content_search.js

function getASINs() {
    const asinElements = document.querySelectorAll('[data-asin]');
    const asins = [];
    asinElements.forEach(element => {
        const asin = element.dataset.asin;
        if (asin && asin.trim() !== "") { // Make sure it's not empty
            asins.push(asin);
        }
    });
    return asins;
}

const asins = getASINs();
if (asins.length > 0) {
	chrome.runtime.sendMessage({ action: "getAsins", asins: asins }); //avoid duplications in list for safe! background logic handle the state if ASIN added it.
}

//listen progress status changes from background page to content
window.addEventListener("message", (event) => {

    if (event.source === window && event.data && event.data.action === "progress")
	{
        // Display progress - using a fixed-position div. More robust.
		const progressDiv = document.getElementById('amazon-scraper-progress') || document.createElement('div');
		progressDiv.id = 'amazon-scraper-progress';

		Object.assign(progressDiv.style, { //styling to
		position: 'fixed', top: '10px', left: '10px', backgroundColor: 'white', padding: '10px', zIndex: 10000, border: '1px solid black' //style attributes
		});
        progressDiv.textContent = event.data.message;  //take main-window message, send also progress when things changes..

        if(!document.getElementById('amazon-scraper-progress')){
            document.body.appendChild(progressDiv);
           }

    }

}, false);