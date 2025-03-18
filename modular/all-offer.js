    (function() { // IIFE for scope isolation

        function extractOffers() {
            // All the offer extraction logic from the previous, fully corrected script goes here.
            // This function *assumes* the aod-container is present.
            const aodContainer = document.getElementById('aod-container');

            // We *know* aodContainer exists here because we either found it initially,
            // or we waited for it to load after clicking the link.

            const offers = [];

            const offerBlocks = aodContainer.querySelectorAll('#aod-offer');
            console.log(`Found ${offerBlocks.length} offer blocks`);

            offerBlocks.forEach((offerBlock, index) => {
                const offerData = {};
                console.log(`Processing offer block ${index + 1}`);

                // --- Offer Condition ---
                const conditionElement = offerBlock.querySelector('#aod-offer-heading .a-text-bold');
                if (conditionElement) {
                offerData.condition = conditionElement.textContent.trim();
                console.log(`  Condition: ${offerData.condition}`);
                } else {
                    console.log("  Condition element not found.");
                }

            // --- Price (Robust Extraction) ---
                const priceElement = offerBlock.querySelector('.a-price');
                if (priceElement) {
                    const offscreenPrice = priceElement.querySelector('.a-offscreen');
                    if (offscreenPrice && offscreenPrice.textContent.trim() !== "") {  // Check for actual content!
                        offerData.price = offscreenPrice.textContent.trim();
                        console.log(`   Price (from a-offscreen): ${offerData.price}`);
                    } else {
                        // Fallback: Construct from parts
                        const whole = priceElement.querySelector('.a-price-whole');
                        const fraction = priceElement.querySelector('.a-price-fraction');
                        const symbol = priceElement.querySelector('.a-price-symbol');


                        if (whole && fraction) {
                            offerData.price = `${symbol ? symbol.textContent.trim() : ''}${whole.textContent.trim()}${fraction.textContent.trim()}`;
                            console.log(`   Price (constructed): ${offerData.price}`);

                        } else if (whole) {
                        offerData.price = whole.textContent.trim();
                        console.log(`   Price (whole only): ${offerData.price}`);
                        }
                        else {
                            console.warn(`   No price elements found within offer block.`);
                        }
                    }
                } else {
                    console.warn(`   No .a-price element found in offer block.`);
                }



            // --- Delivery Promise ---
            const deliveryPromiseElement = offerBlock.querySelector('.aod-delivery-promise > span.a-color-base');
                if (deliveryPromiseElement) {
                    offerData.deliveryPromise = deliveryPromiseElement.textContent.trim();
                    console.log(`  Delivery Promise: ${offerData.deliveryPromise}`); // Log delivery promise
                } else{
                    console.log(" Delivery promise element not found")
                }

                // --- Ships from ---
                const shipsFromElement = offerBlock.querySelector('#aod-offer-shipsFrom .a-size-small.a-color-base');
                if (shipsFromElement) {
                    offerData.shipsFrom = shipsFromElement.textContent.trim();
                    console.log(`  Ships From: ${offerData.shipsFrom}`); // Log Ships From
                } else{
                    console.log("  Ships from element not found")
                }
                // --- Sold by ---
                const soldByElement = offerBlock.querySelector('#aod-offer-soldBy .a-link-normal');
                if (soldByElement) {
                    offerData.soldBy = soldByElement.textContent.trim();
                    offerData.soldByLink = soldByElement.href;
                    console.log(`  Sold By: ${offerData.soldBy}`);  // Log Sold By
                    console.log(`  Sold By Link: ${offerData.soldByLink}`);
                } else{
                    console.log("  Sold by element not found")
                }

                // --- Seller Rating ---
                const sellerRating = {};
                const ratingIcon = offerBlock.querySelector('.aod-offer-seller-rating i.a-icon-star-mini');
                const ratingTextElement = offerBlock.querySelector('.aod-offer-seller-rating .a-size-small.a-color-base');

                if (ratingIcon) {
                    const ariaLabel = ratingIcon.querySelector('.a-icon-alt');
                    if (ariaLabel) {
                        sellerRating.ratingText = ariaLabel.textContent.trim();
                        console.log(`  Seller Rating Text: ${sellerRating.ratingText}`); // Log Seller Rating text
                    }
                    else{
                        console.log("  Seller rating text not found");
                    }
                }
                if (ratingTextElement) {
                    sellerRating.ratingDetails = ratingTextElement.textContent.trim();
                    console.log(`  Seller Rating Details: ${sellerRating.ratingDetails}`); // Log Seller Rating details
                }

                if (Object.keys(sellerRating).length > 0) {
                    offerData.sellerRating = sellerRating;
                }

                // --- Condition Details ---
                const conditionDetailsElement = offerBlock.querySelector('#aod-condition-container .expandable-text');
                if (conditionDetailsElement) {
                    const collapsedText = conditionDetailsElement.querySelector('.expandable-collapsed-text .a-truncate-full');
                    const expandedTextElement = conditionDetailsElement.querySelector('.expandable-expanded-text');
                    if(collapsedText){
                        offerData.conditionDetails = collapsedText.textContent.trim();
                        console.log(`  Condition Details (collapsed): ${offerData.conditionDetails}`);
                    }

                    if (expandedTextElement) {
                        offerData.conditionDetails = expandedTextElement.textContent.trim();
                        console.log(`  Condition Details (expanded): ${offerData.conditionDetails}`);
                    }
                    else{
                        console.log("  Condition Details element not found")
                    }

                }
                else{
                    console.log("  Condition Details element not found")
                }

                offers.push(offerData);
            });

            // --- Extract "Other Options" Text ---
            const otherOptionsHeading = aodContainer.querySelector('#aod-filter-offer-count-string');
            const otherOptionsSorted = aodContainer.querySelector('#aod-sort-details-string')
            let otherOptions = null;
            if(otherOptionsHeading)
            {
            otherOptions = {
                heading: otherOptionsHeading.textContent.trim()
            }
            if(otherOptionsSorted){
                otherOptions.sort = otherOptionsSorted.textContent.trim();
            }
            console.log("Other Options:", otherOptions);
            }
            else{
                console.log("Other options heading not found");
                }

            console.log("Offers:", offers);
        }


        // --- Main Execution Flow ---

        let aodContainer = document.getElementById('aod-container');

        if (aodContainer) {
            // Case 1: aod-container is ALREADY present.  Extract the offers.
            extractOffers();
        } else {
            // Case 2: aod-container is NOT present.  Find the link, click it, and THEN extract.
            const otherSellersLink = document.getElementById('aod-ingress-link');

            if (otherSellersLink) {
                // Function to wait for an element to appear
                function waitForElement(selector, callback) {
                    const observer = new MutationObserver((mutations, observerInstance) => {
                        const element = document.querySelector(selector);
                        if (element) {
                            observerInstance.disconnect(); // Stop observing
                            callback(element); // Call the callback with the element
                        }
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
                // Use the function to click, and then call the function
                otherSellersLink.click();
                waitForElement('#aod-container', (element) => {
                    extractOffers();
                });

            } else {
                console.log("Link to 'All Offers' page not found.");
            }
        }

    })();