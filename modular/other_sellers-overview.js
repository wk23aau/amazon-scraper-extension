(function() { // IIFE for scope isolation

    const otherSellersDiv = document.getElementById('dynamic-aod-ingress-box');

    if (!otherSellersDiv) {
        console.log("Other Sellers section not found.");
        return;
    }

    const otherSellersData = {};

    // --- 1. "Other sellers on Amazon" Heading ---
    const heading = otherSellersDiv.querySelector('.daodi-header-font');
    if (heading) {
        otherSellersData.heading = heading.textContent.trim();
    }

    // --- 2. Number of Offers and Starting Price ---
    const linkElement = otherSellersDiv.querySelector('#aod-ingress-link');
    if (linkElement) {
        const offersText = linkElement.querySelector('.a-color-base:first-of-type'); // First span with a-color-base
        const priceElement = linkElement.querySelector('.a-price .a-offscreen');

        if (offersText) {
          // Extract number of offers using regular expression
          const match = offersText.textContent.trim().match(/New & Used \((\d+)\) from/);
            if (match) {
              otherSellersData.numOffers = parseInt(match[1], 10); // Convert to integer
          }
        }

        if (priceElement) {
            otherSellersData.startingPrice = priceElement.textContent.trim();
        }
          // --- 3. Get the URL ---
        otherSellersData.url = linkElement.href;
      // --- 4. FREE Shipping ---
        const freeShipping = linkElement.querySelector('b');
        if (freeShipping)
        {
          otherSellersData.freeShipping = freeShipping.textContent.trim();
        }
    }

    console.log("Other Sellers Data:", otherSellersData);

})();