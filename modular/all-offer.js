//console script
async function extractOffersFromDocument(doc, pageNumber) {
    console.log(`Extracting offers from page ${pageNumber}...`);
    let aodContainer;
    if (pageNumber === 1) {
        aodContainer = doc.getElementById('aod-container');
        if (!aodContainer) {
            console.warn(`aod-container not found in fetched AJAX content for page ${pageNumber}. Offers may not be extracted correctly.`);
            // Proceed without aodContainer for page 1, try to get offers directly
        }
    }

    const offers = [];
    let pinnedOfferData = null; // To store pinned offer data

    // --- Extract Pinned Offer (only on page 1) ---
    if (pageNumber === 1) {
        const pinnedOfferBlock = doc.getElementById('aod-pinned-offer');
        if (pinnedOfferBlock) {
            pinnedOfferData = {};
            console.log("Processing Pinned Offer Block (Page 1)");

            // Condition extraction
            try {
                const conditionElement = pinnedOfferBlock.querySelector('#aod-offer-heading .a-text-bold');
                pinnedOfferData.condition = conditionElement ? conditionElement.textContent.trim() : null;
            } catch (error) {
                console.warn("Error extracting pinned offer condition:", error);
                pinnedOfferData.condition = null;
            }

            // --- Enhanced Pinned Offer Price and Discount Extraction ---
            pinnedOfferData.priceDetails = {};
            try {
                const priceBlockElement = pinnedOfferBlock.querySelector('#aod-price-0');
                if (priceBlockElement) {
                    // Offer Price Extraction (Prioritize a-offscreen, then construct)
                    try {
                        const offerPriceElement = priceBlockElement.querySelector('.a-price');
                        if (offerPriceElement) {
                            let offerPrice = '';
                            const offscreenPrice = offerPriceElement.querySelector('.a-offscreen');
                            if (offscreenPrice && offscreenPrice.textContent.trim()) {
                                offerPrice = offscreenPrice.textContent.trim();
                                console.log(`   Pinned Offer: Price (from a-offscreen): ${offerPrice}`);
                            } else {
                                const symbol = offerPriceElement.querySelector('.a-price-symbol')?.textContent.trim() || '';
                                const whole = offerPriceElement.querySelector('.a-price-whole')?.textContent.trim() || '';
                                const fraction = offerPriceElement.querySelector('.a-price-fraction')?.textContent.trim() || '';
                                if (whole) {
                                    offerPrice = `${symbol}${whole}${fraction ? '.' + fraction : ''}`;
                                    console.log(`   Pinned Offer: Price (constructed): ${offerPrice}`);
                                } else {
                                    console.warn('   Pinned Offer: All offer price extraction methods failed');
                                }
                            }
                            pinnedOfferData.priceDetails.offerPrice = offerPrice;
                        } else {
                            console.warn('Pinned Offer: No offer price element found.');
                        }
                    } catch (offerPriceError) {
                        console.warn("Pinned Offer: Error extracting offer price:", offerPriceError);
                        pinnedOfferData.priceDetails.offerPrice = null;
                    }

                    // Discount Percentage Extraction
                    try {
                        const discountElement = priceBlockElement.querySelector('.centralizedApexPriceSavingsPercentageMargin');
                        pinnedOfferData.priceDetails.discountPercentage = discountElement ? discountElement.textContent.trim() : null;
                        if (pinnedOfferData.priceDetails.discountPercentage) console.log(`   Pinned Offer: Discount Percentage: ${pinnedOfferData.priceDetails.discountPercentage}`);
                    } catch (discountError) {
                        console.warn("Pinned Offer: Error extracting discount percentage:", discountError);
                        pinnedOfferData.priceDetails.discountPercentage = null;
                    }

                    // RRP (Was Price) Extraction
                    try {
                        const rrpElement = priceBlockElement.querySelector('.centralizedApexBasisPriceCSS .a-offscreen'); // Corrected selector
                        pinnedOfferData.priceDetails.rrp = rrpElement ? rrpElement.textContent.trim() : null;
                         if (pinnedOfferData.priceDetails.rrp) console.log(`   Pinned Offer: RRP: ${pinnedOfferData.priceDetails.rrp}`);
                    } catch (rrpError) {
                        console.warn("Pinned Offer: Error extracting RRP:", rrpError);
                        pinnedOfferData.priceDetails.rrp = null;
                    }


                } else {
                    console.warn("Pinned Offer: Price block element not found.");
                }
            } catch (priceBlockError) {
                console.warn("Pinned Offer: Error extracting price details block:", priceBlockError);
            }


            // Delivery Promise (Corrected selector - direct aod-delivery-promise > span)
            try {
                const deliveryPromiseElement = pinnedOfferBlock.querySelector('.aod-delivery-promise > span.a-color-base');
                pinnedOfferData.deliveryPromise = deliveryPromiseElement ? deliveryPromiseElement.textContent.trim() : null;
            } catch (deliveryPromiseError) {
                console.warn("Pinned Offer: Error extracting delivery promise:", deliveryPromiseError);
                pinnedOfferData.deliveryPromise = null;
            }


            // Delivery Information (Pinned Offer - Full Extraction)
            try {
                const deliveryInfoElementPinned = pinnedOfferBlock.querySelector('.aod-delivery-promise-column .aod-unified-delivery');
                if (deliveryInfoElementPinned) {
                    pinnedOfferData.deliveryInformation = {};

                    // Free Delivery (Corrected selector)
                    try {
                        const freeDeliveryElement = deliveryInfoElementPinned.querySelector('#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE span');
                        if (freeDeliveryElement) {
                            pinnedOfferData.deliveryInformation.freeDeliveryText = freeDeliveryElement.textContent.trim();
                            pinnedOfferData.deliveryInformation.freeDeliveryDetailsLink = freeDeliveryElement.querySelector('a[aria-label="Details about delivery costs and delivery methods"]')?.href || null;
                        }
                    } catch (freeDeliveryError) {
                        console.warn("Pinned Offer: Error extracting free delivery info:", freeDeliveryError);
                    }


                    // Fastest Delivery (Corrected selector)
                    try {
                        const fastestDeliveryElement = deliveryInfoElementPinned.querySelector('#mir-layout-DELIVERY_BLOCK-slot-SECONDARY_DELIVERY_MESSAGE_LARGE span');
                        if (fastestDeliveryElement) {
                            pinnedOfferData.deliveryInformation.fastestDeliveryText = fastestDeliveryElement.textContent.trim();
                            pinnedOfferData.deliveryInformation.fastestDeliveryDetailsLink = fastestDeliveryElement.querySelector('a[aria-label="Details about delivery costs and delivery methods"]')?.href || null;
                            const cutoffTimeElement = fastestDeliveryElement.querySelector('#ftCountdown');
                            if (cutoffTimeElement) pinnedOfferData.deliveryInformation.fastestDeliveryCutoff = cutoffTimeElement.textContent.trim();
                        }
                    } catch (fastestDeliveryError) {
                        console.warn("Pinned Offer: Error extracting fastest delivery info:", fastestDeliveryError);
                    }
                }
            } catch (deliveryInfoBlockError) {
                console.warn("Pinned Offer: Error extracting delivery information block:", deliveryInfoBlockError);
            }


            // Ships from
            try {
                const shipsFromElement = pinnedOfferBlock.querySelector('#aod-offer-shipsFrom .a-size-small.a-color-base');
                pinnedOfferData.shipsFrom = shipsFromElement ? shipsFromElement.textContent.trim() : null;
            } catch (shipsFromError) {
                console.warn("Pinned Offer: Error extracting ships from information:", shipsFromError);
                pinnedOfferData.shipsFrom = null;
            }


            // Sold by
            try {
                const soldByElement = pinnedOfferBlock.querySelector('#aod-offer-soldBy .a-size-small.a-color-base');
                pinnedOfferData.soldBy = soldByElement ? soldByElement.textContent.trim() : null;
            } catch (soldByError) {
                console.warn("Pinned Offer: Error extracting sold by information:", soldByError);
                pinnedOfferData.soldBy = null;
            }


            // Seller rating
            pinnedOfferData.sellerRating = {};
            try {
                const ratingIcon = pinnedOfferBlock.querySelector('.aod-offer-seller-rating i.a-icon-star-mini');
                const ratingTextElement = pinnedOfferBlock.querySelector('.aod-offer-seller-rating .a-size-small.a-color-base');
                if (ratingIcon) {
                    const ariaLabel = ratingIcon.querySelector('.a-icon-alt');
                    pinnedOfferData.sellerRating.ratingText = ariaLabel ? ariaLabel.textContent.trim() : null;
                }
                pinnedOfferData.sellerRating.ratingDetails = ratingTextElement ? ratingTextElement.textContent.trim() : null;

                if (Object.keys(pinnedOfferData.sellerRating).length === 0) {
                    delete pinnedOfferData.sellerRating; // Remove if no rating data extracted
                }

            } catch (sellerRatingError) {
                console.warn("Pinned Offer: Error extracting seller rating:", sellerRatingError);
                delete pinnedOfferData.sellerRating;
            }


            // Product title and reviews (moved outside seller rating try-catch for independent extraction)
            try {
                const productTitleElement = pinnedOfferBlock.querySelector('#aod-asin-title-text');
                pinnedOfferData.productTitle = productTitleElement ? productTitleElement.textContent.trim() : null;
            } catch (productTitleError) {
                console.warn("Pinned Offer: Error extracting product title:", productTitleError);
                pinnedOfferData.productTitle = null;
            }
        } else {
            console.log("No Pinned Offer Block found on Page 1.");
        }
    }

    // Regular offers extraction (price extraction logic already updated in previous response)
    const offerBlocks = aodContainer ? aodContainer.querySelectorAll('#aod-offer') : doc.querySelectorAll('#aod-offer');
    offerBlocks.forEach((offerBlock, index) => {
        const offerData = {};
        console.log(`Processing regular offer ${index + 1} on page ${pageNumber}`);

        // ... (rest of the regular offer extraction code - condition, price, delivery, seller info - remains the same from previous response) ...
         // Condition
        try {
            const conditionElement = offerBlock.querySelector('#aod-offer-heading .a-text-bold');
            offerData.condition = conditionElement ? conditionElement.textContent.trim() : null;
        } catch (error) {
            console.warn(`Offer ${index + 1}: Error extracting condition:`, error);
            offerData.condition = null;
        }


        // --- Enhanced Price Extraction ---
        try {
            const priceElement = offerBlock.querySelector('.a-price');
            if (priceElement) {
                let price = '';

                // First try: Check for .a-offscreen (hidden price text)
                const offscreenPrice = priceElement.querySelector('.a-offscreen');
                if (offscreenPrice && offscreenPrice.textContent.trim()) {
                    price = offscreenPrice.textContent.trim();
                    console.log(`   Offer ${index + 1}: Price (from a-offscreen): ${price}`);
                } else {
                    // Fallback 1: Check for visible price components
                    const symbol = priceElement.querySelector('.a-price-symbol')?.textContent.trim() || '';
                    const whole = priceElement.querySelector('.a-price-whole')?.textContent.trim() || '';
                    const fraction = priceElement.querySelector('.a-price-fraction')?.textContent.trim() || '';

                    if (whole) {
                        price = `${symbol}${whole}${fraction ? '.' + fraction : ''}`;
                        console.log(`   Offer ${index + 1}: Price (constructed): ${price}`);
                    } else {
                        // Fallback 2: Check for alternative price container
                        const altPrice = priceElement.querySelector('.a-size-base.a-color-price')?.textContent.trim();
                        if (altPrice) {
                            price = altPrice;
                            console.log(`   Offer ${index + 1}: Price (alternative): ${price}`);
                        } else {
                            console.warn(`   Offer ${index + 1}: All price extraction methods failed`);
                        }
                    }
                }

                offerData.price = price;
            } else {
                console.warn(`Offer ${index + 1}: No price element found`);
                offerData.price = null; // Ensure price is null if not found
            }
        } catch (priceError) {
            console.warn(`Offer ${index + 1}: Error during enhanced price extraction:`, priceError);
            offerData.price = null; // Ensure price is null in case of error
        }


        // Delivery promise (Corrected selector)
        try {
            const deliveryPromiseElement = offerBlock.querySelector('.aod-delivery-promise > span.a-color-base');
            offerData.deliveryPromise = deliveryPromiseElement ? deliveryPromiseElement.textContent.trim() : null;
        } catch (deliveryPromiseError) {
            console.warn(`Offer ${index + 1}: Error extracting delivery promise:`, deliveryPromiseError);
            offerData.deliveryPromise = null;
        }


        // Delivery Information (Regular Offers - Full Extraction)
        try {
            const deliveryInfoElementOffer = offerBlock.querySelector('.aod-delivery-promise-column .aod-unified-delivery');
            if (deliveryInfoElementOffer) {
                offerData.deliveryInformation = {};

                // Free Delivery (Corrected selector)
                try {
                    const freeDeliveryElement = deliveryInfoElementOffer.querySelector('#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE span');
                    if (freeDeliveryElement) {
                        offerData.deliveryInformation.freeDeliveryText = freeDeliveryElement.textContent.trim();
                        offerData.deliveryInformation.freeDeliveryDetailsLink = freeDeliveryElement.querySelector('a[aria-label="Details about delivery costs and delivery methods"]')?.href || null;
                    }
                } catch (freeDeliveryError) {
                    console.warn(`Offer ${index + 1}: Error extracting free delivery info:`, freeDeliveryError);
                }


                // Fastest Delivery (Corrected selector)
                try {
                    const fastestDeliveryElement = deliveryInfoElementOffer.querySelector('#mir-layout-DELIVERY_BLOCK-slot-SECONDARY_DELIVERY_MESSAGE_LARGE span');
                    if (fastestDeliveryElement) {
                        offerData.deliveryInformation.fastestDeliveryText = fastestDeliveryElement.textContent.trim();
                        offerData.deliveryInformation.fastestDeliveryDetailsLink = fastestDeliveryElement.querySelector('a[aria-label="Details about delivery costs and delivery methods"]')?.href || null;
                        const cutoffTimeElement = fastestDeliveryElement.querySelector('#ftCountdown');
                        if (cutoffTimeElement) offerData.deliveryInformation.fastestDeliveryCutoff = cutoffTimeElement.textContent.trim();
                    }
                } catch (fastestDeliveryError) {
                    console.warn(`Offer ${index + 1}: Error extracting fastest delivery info:`, fastestDeliveryError);
                }
            }
        } catch (deliveryInfoBlockError) {
            console.warn(`Offer ${index + 1}: Error extracting delivery information block:`, deliveryInfoBlockError);
        }


        // Ships from
        try {
            const shipsFromElement = offerBlock.querySelector('#aod-offer-shipsFrom .a-size-small.a-color-base');
            offerData.shipsFrom = shipsFromElement ? shipsFromElement.textContent.trim() : null;
        } catch (shipsFromError) {
            console.warn(`Offer ${index + 1}: Error extracting ships from information:`, shipsFromError);
            offerData.shipsFrom = null;
        }


        // Sold by
        try {
            const soldByElement = offerBlock.querySelector('#aod-offer-soldBy .a-link-normal');
            if (soldByElement) {
                offerData.soldBy = soldByElement.textContent.trim();
                offerData.soldByLink = soldByElement.href;
            } else {
                console.warn(`Offer ${index + 1}: Sold by element not found.`);
                offerData.soldBy = null;
                offerData.soldByLink = null;
            }
        } catch (soldByError) {
            console.warn(`Offer ${index + 1}: Error extracting sold by information:`, soldByError);
            offerData.soldBy = null;
            offerData.soldByLink = null;
        }


        // Seller rating
        offerData.sellerRating = {};
        try {
            const ratingIcon = offerBlock.querySelector('.aod-offer-seller-rating i.a-icon-star-mini');
            const ratingTextElement = offerBlock.querySelector('.aod-offer-seller-rating .a-size-small.a-color-base');
            if (ratingIcon) {
                const ariaLabel = ratingIcon.querySelector('.a-icon-alt');
                offerData.sellerRating.ratingText = ariaLabel ? ariaLabel.textContent.trim() : null;
            }
            offerData.sellerRating.ratingDetails = ratingTextElement ? ratingTextElement.textContent.trim() : null;

            if (Object.keys(offerData.sellerRating).length === 0) {
                delete offerData.sellerRating; // Remove if no rating data extracted
            }

        } catch (sellerRatingError) {
            console.warn(`Offer ${index + 1}: Error extracting seller rating:`, sellerRatingError);
            delete offerData.sellerRating;
        }


        offers.push(offerData);
    });

    // Other options text (only on page 1)
    let otherOptions = null;
    if (pageNumber === 1 && aodContainer) {
        try {
            const otherOptionsHeading = aodContainer.querySelector('#aod-filter-offer-count-string');
            const otherOptionsSorted = aodContainer.querySelector('#aod-sort-details-string');
            if (otherOptionsHeading) {
                otherOptions = { heading: otherOptionsHeading.textContent.trim() };
                if (otherOptionsSorted) otherOptions.sort = otherOptionsSorted.textContent.trim();
            }
        } catch (otherOptionsError) {
            console.warn("Page 1: Error extracting 'Other Options' text:", otherOptionsError);
            otherOptions = null;
        }

    }

    return {
        pinnedOffer: pageNumber === 1 ? pinnedOfferData : null,
        offers: offers,
        otherOptions: pageNumber === 1 ? otherOptions : null
    };
}


(async () => {
    let allOffersData = {
        pinnedOffer: null,
        offers: [],
        otherOptions: null
    };
    let mainPageOffers;

    // **Hardcode URLs Here!**  <-----------------------  IMPORTANT!
    let mainOffersAjaxURL = "PASTE_YOUR_MAIN_OFFERS_AJAX_URL_HERE"; //  e.g., "/aod/ajax?asin=...&index=0&..."
    let page2OffersAjaxURL = "PASTE_YOUR_PAGE_2_OFFERS_AJAX_URL_HERE"; // e.g., "/aod/ajax?asin=...&index=10&page=2&..."


    try {
        // Fetch main page
        console.log("Fetching Main Offers Page (Page 1)...");
        const mainResponse = await fetch(mainOffersAjaxURL);
        if (!mainResponse.ok) throw new Error(`HTTP error! status: ${mainResponse.status}`);
        const mainParsedDoc = new DOMParser().parseFromString(await mainResponse.text(), 'text/html');
        mainPageOffers = await extractOffersFromDocument(mainParsedDoc, 1);

        if (mainPageOffers) {
            allOffersData = {
                pinnedOffer: mainPageOffers.pinnedOffer,
                offers: mainPageOffers.offers,
                otherOptions: mainPageOffers.otherOptions
            };
        }

        // Fetch page 2
        if (mainPageOffers) {
            console.log("Fetching Page 2 Offers...");
            const page2Response = await fetch(page2OffersAjaxURL);
            if (!page2Response.ok) throw new Error(`HTTP error! status: ${page2Response.status}`);
            const page2ParsedDoc = new DOMParser().parseFromString(await page2Response.text(), 'text/html');
            const page2Offers = await extractOffersFromDocument(page2ParsedDoc, 2);
            if (page2Offers) {
                allOffersData.offers = allOffersData.offers.concat(page2Offers.offers);
            }
        }

        console.log("Extracted All Offers Data:", allOffersData);

    } catch (error) {
        console.error("Error:", error);
    }
})();

/*
 **Instructions:**

 1.  **Find Real AJAX URLs:**
     *   Go to an Amazon product page with multiple offers.
     *   Open browser developer tools (F12), Network tab, and filter for "Fetch/XHR" or "XHR".
     *   Click on "See all offers" or navigate to page 2 of offers.
     *   Look at the network requests. Identify the requests that fetch offer data (likely containing "aod" in the URL).
     *   **Copy the URLs** for page 1 and page 2 of offers.

 2.  **Hardcode URLs in Script:**
     *   **Replace** `"PASTE_YOUR_MAIN_OFFERS_AJAX_URL_HERE"` with the URL you copied for page 1.
     *   **Replace** `"PASTE_YOUR_PAGE_2_OFFERS_AJAX_URL_HERE"` with the URL for page 2.
     *   **Keep the quotes** around the URLs!

 3.  **Copy and Paste Script:** Copy the *entire* modified script.
 4.  **Open Browser Console:** Open the browser console on the Amazon product page.
 5.  **Paste and Run:** Paste the script and press `Enter`.
 6.  **Check Output:** Look in the console for the "Extracted All Offers Data:" message and the JSON output.

 **Important:**
 *   Hardcoding URLs is less flexible. If Amazon changes their URL structure, you'll need to update the hardcoded URLs in the script again.
 *   This script is designed for a specific Amazon page structure. It might not work on all Amazon pages or in all locales if the HTML structure is different.
 */