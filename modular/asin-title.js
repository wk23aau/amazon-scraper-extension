// modular/asin_title.js (No changes - still correct)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeProductTitleAndASIN() {
    await delay(500);
    const productTitleElement = document.getElementById('productTitle');
    const title = productTitleElement ? productTitleElement.innerText.trim() : null;
    let asin = null;

    const asinElement = document.querySelector('[data-asin], [data-csa-c-asin]');
    if (asinElement) {
        asin = asinElement.dataset.asin || asinElement.dataset.csaCAsin;
    }

    if (!asin) {
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const asinMatch = script.textContent.match(/"asin"\s*:\s*"([A-Z0-9]+)"/);
            if (asinMatch && asinMatch[1]) {
                asin = asinMatch[1];
                break;
            }
        }
    }
    return { productTitle: title, asin: asin };
}

export { scrapeProductTitleAndASIN };