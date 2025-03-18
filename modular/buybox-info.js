(function() {  // IIFE for scope isolation

    const desktopBuyboxDiv = document.getElementById('desktop_buybox');

    if (!desktopBuyboxDiv) {
        console.log("Desktop Buybox section not found.");
        return;
    }

    const buyboxData = {};

   // --- 1. "Buy new" Price ---
    const buyNewPriceElement = desktopBuyboxDiv.querySelector('#newAccordionRow_0 .a-price .a-offscreen');
    if (buyNewPriceElement) {
        buyboxData.buyNewPrice = buyNewPriceElement.textContent.trim();
    }

    // --- 2. "Buy new" Section Availability ---
    const buyNewAvailabilityElement = desktopBuyboxDiv.querySelector('#newAccordionRow_0 #availability span');
    if (buyNewAvailabilityElement)
    {
        buyboxData.buyNewAvailability = buyNewAvailabilityElement.textContent.trim();
    }


    // --- 3. "Buy Used" Price ---
    const buyUsedPriceElement = desktopBuyboxDiv.querySelector('#usedAccordionRow .a-price .a-offscreen');
     if (buyUsedPriceElement) {
        buyboxData.buyUsedPrice = buyUsedPriceElement.textContent.trim();
    }

    // --- 4. "Buy Used" Availability ---
      const buyUsedAvailabilityElement = desktopBuyboxDiv.querySelector('#usedAccordionRow #availability span');
    if (buyUsedAvailabilityElement)
    {
        buyboxData.buyUsedAvailability = buyUsedAvailabilityElement.textContent.trim();
    }
    // --- 5. "Ships from" (New) ---
    const shipsFromNewElement = desktopBuyboxDiv.querySelector('#newAccordionRow_0 #sfsb_accordion_head .a-row:nth-child(1) .truncate .a-size-small:nth-child(2)');
    if (shipsFromNewElement) {
        buyboxData.shipsFromNew = shipsFromNewElement.textContent.trim();
    }

    // --- 6. "Sold by" (New) ---
    const soldByNewElement = desktopBuyboxDiv.querySelector('#newAccordionRow_0 #sfsb_accordion_head .a-row:nth-child(2) .truncate .a-size-small:nth-child(2)');
      if (soldByNewElement) {
        buyboxData.soldByNew = soldByNewElement.textContent.trim();
    }


    // --- 7. "Ships from" (Used) ---
      const shipsFromUsedElement = desktopBuyboxDiv.querySelector('#usedAccordionRow #sfsb_accordion_head .a-row:nth-child(1) .truncate .a-size-small:nth-child(2)');

    if (shipsFromUsedElement) {
        buyboxData.shipsFromUsed = shipsFromUsedElement.textContent.trim();
    }

    // --- 8. "Sold by" (Used) ---
    const soldByUsedElement = desktopBuyboxDiv.querySelector('#usedAccordionRow #sfsb_accordion_head .a-row:nth-child(2) .truncate .a-size-small:nth-child(2)');
    if (soldByUsedElement) {
      buyboxData.soldByUsed = soldByUsedElement.textContent.trim();
    }

     // --- 9. Quantity ---
    const quantityElement = desktopBuyboxDiv.querySelector('#selectQuantity select#quantity');
     if (quantityElement) {
       buyboxData.quantityAvailable = Array.from(quantityElement.options).map(option => option.value);
    }


    console.log("Buybox Data:", buyboxData);

})();