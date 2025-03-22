//with tech details - FINAL SCRIPT - COMPLETE & UPDATED with AOD Price & WhatsInBox Fixes
(async function() {
    // **URLs - IMPORTANT: CAREFULLY REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL AMAZON URLs!**
    const productURL = "https://www.amazon.co.uk/dp/B0D35YY6V4/"; //  e.g., "https://www.amazon.co.uk/dp/B0B7NTY2S6"
    const mainOffersAjaxURL = "https://www.amazon.co.uk/gp/product/ajax/ref=dp_aod_ALL_mbc?asin=B0D35YY6V4&m=&qid=1742650932&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-5&pc=dp&experienceId=aodAjaxMain";
    const page2OffersAjaxURL = "https://www.amazon.co.uk/gp/product/ajax/ref=aod_page_2?asin=B0D35YY6V4&m=&qid=1742650932&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-5&pc=dp&isonlyrenderofferlist=true&pageno=2&experienceId=aodAjaxMain";


    async function scrapeProductPage(productUrl, mainOffersUrl, page2OffersUrl) {
        let allProductData = {};

        try {
            // --- Fetch and Parse Product Page ---
            console.log(`Fetching Product Page: ${productUrl}...`);
            const productResponse = await fetch(productUrl);
            if (!productResponse.ok) throw new Error(`HTTP error! status: ${productResponse.status} for URL: ${productUrl}`);
            const productHTMLText = await productResponse.text();
            const productParsedDoc = new DOMParser().parseFromString(productHTMLText, 'text/html');

            // --- Scrape Data from Product Page Sections ---
            console.log("Extracting data from product page sections...");

            allProductData.asinTitle = await scrapeProductTitle(productParsedDoc);
            allProductData.aboutFeatures = extractAboutFeatures(productParsedDoc);
            allProductData.brandInsights = extractBrandInsights(productParsedDoc);
            allProductData.boughtCountPeriod = extractBoughtCountPeriod(productParsedDoc);
            allProductData.categorySubnav = extractCategorySubnav(productParsedDoc);
            allProductData.buyboxInfo = extractBuyboxInfo(productParsedDoc);
            allProductData.overviewBrand = extractOverviewBrand(productParsedDoc);
            allProductData.productInformation = extractProductInformation(productParsedDoc); // Replaced aplusContent
            allProductData.whatsInBox = extractWhatsInBox(productParsedDoc);
            // allProductData.otherSellersOverview = extractOtherSellersOverview(productParsedDoc); // Removed as requested

            // --- Fetch and Process All Offers Pages ---
            console.log("Fetching and processing All Offers pages...");
            const allOffersData = await fetchAndExtractAllOffers(mainOffersUrl, page2OffersUrl);
            allProductData.allOffers = allOffersData;


            console.log("--- Full Product Data Extraction Complete! ---");
            return allProductData;


        } catch (error) {
            console.error(" 종합 에러 발생:", error);
            return null; // Or handle error as needed
        }
    }


    // --- Individual Extraction Functions with Error Handling and Updates - Minimal Logs ---

    function extractAboutFeatures(doc) {
        try {
            const featureBulletsDiv = doc.getElementById('featurebullets_feature_div');
            if (!featureBulletsDiv) return { aboutThisItemText: null, features: null };

            const features = [];
            let aboutThisItemText = null;

            const heading = featureBulletsDiv.querySelector('h1.a-size-base-plus.a-text-bold');
            if (heading) aboutThisItemText = heading.textContent.trim();
            const listItems = featureBulletsDiv.querySelectorAll('ul.a-unordered-list li.a-spacing-mini span.a-list-item');
            listItems.forEach(item => {
                const featureText = item.textContent.trim();
                const cleanedFeatureText = featureText.replace(/\s+/g, ' ').replace(/\*+/g, '*').trim();
                features.push(cleanedFeatureText);
            });
            return { aboutThisItemText, features };
        } catch (error) {
            console.error("Error in extractAboutFeatures:", error);
            return { aboutThisItemText: null, features: null };
        }
    }

    function extractBrandInsights(doc) {
        try {
            const brandInsightsDiv = doc.getElementById('brandInsights_feature_div_3');
            if (!brandInsightsDiv) return {}; // Handle missing section, return empty object
            const brandInsights = {};
            const heading = brandInsightsDiv.querySelector('h2.a-size-medium.a-spacing-small');
            if (heading) brandInsights.topBrand = heading.textContent.trim();
            const insightBoxes = brandInsightsDiv.querySelectorAll('.a-column .a-box.a-color-alternate-background');
            insightBoxes.forEach(box => {
                const titleElement = box.querySelector('.a-text-bold');
                const descriptionElement = box.querySelector('.a-row:nth-child(2) .a-size-small');
                if (titleElement && descriptionElement) {
                    const key = titleElement.textContent.trim().toLowerCase().replace(/\s+/g, '_');
                    brandInsights[key] = descriptionElement.textContent.trim();
                }
            });
            return brandInsights;
        } catch (error) {
            console.warn("Warning in extractBrandInsights (section might be missing):", error); // Use warn instead of error as it's optional
            return {};
        }
    }

    function extractBoughtCountPeriod(doc) {
        try {
            const faceoutDiv = doc.getElementById('socialProofingAsinFaceout_feature_div');
            if (!faceoutDiv) return { boughtCount: null, boughtPeriod: null };
            let boughtCount = null;
            let boughtPeriod = null;
            const titleSpan = faceoutDiv.querySelector('#social-proofing-faceout-title-tk_bought .a-text-bold');
            const periodSpan = faceoutDiv.querySelector('#social-proofing-faceout-title-tk_bought span:not(.a-text-bold)');
            if (titleSpan) boughtCount = titleSpan.textContent.trim().match(/^\d+(?:\.\d+)?K?\+?/)?.[0] || null;
            if (periodSpan) boughtPeriod = periodSpan.textContent.trim();
            return { boughtCount, boughtPeriod };
        } catch (error) {
            console.error("Error in extractBoughtCountPeriod:", error);
            return { boughtCount: null, boughtPeriod: null };
        }
    }

    function extractCategorySubnav(doc) {
        try {
            const breadcrumbDiv = doc.getElementById('wayfinding-breadcrumbs_feature_div'); // Updated ID based on screenshot
            if (!breadcrumbDiv) return { categoryPath: [] }; // Changed return structure and handle missing section

            const categoryPath = [];
            const breadcrumbLinks = breadcrumbDiv.querySelectorAll('a.a-link-normal.a-color-tertiary'); // Selector for breadcrumb links
            breadcrumbLinks.forEach(link => {
                const categoryText = link.textContent.trim();
                categoryPath.push(categoryText);
            });
            return { categoryPath: categoryPath }; // Return categoryPath array
        } catch (error) {
            console.error("Error in extractCategorySubnav:", error);
            return { categoryPath: [] }; // Return empty categoryPath on error
        }
    }


    function extractBuyboxInfo(doc) {
        try {
            const buyboxData = {};

            // Availability Status
            const availabilityElement = doc.getElementById('availability');
            buyboxData.availability = availabilityElement ? availabilityElement.textContent.trim() : null;

            // Delivery Message
            const deliveryBlockMessageElement = doc.getElementById('deliveryBlockMessage');
            buyboxData.deliveryMessage = deliveryBlockMessageElement ? deliveryBlockMessageElement.textContent.trim() : null;

             // Delivery Abbreviated Message
            const deliveryBlockAbbreviated_feature_divElement = doc.getElementById('deliveryBlockAbbreviated_feature_div');
            buyboxData.deliveryAbbreviated = deliveryBlockAbbreviated_feature_divElement ? deliveryBlockAbbreviated_feature_divElement.textContent.trim() : null;


            // Fulfiller Info (Ships from/Sold by for New - might need further parsing of text)
            const fulfillerInfoFeature_feature_divElement = doc.getElementById('fulfillerInfoFeature_feature_div');
            buyboxData.fulfillerInfo = fulfillerInfoFeature_feature_divElement ? fulfillerInfoFeature_feature_divElement.textContent.trim() : null;

            // Merchant Info (Sold by info - might need further parsing)
            const merchantInfoFeature_feature_divElement = doc.getElementById('merchantInfoFeature_feature_div');
            buyboxData.merchantInfo = merchantInfoFeature_feature_divElement ? merchantInfoFeature_feature_divElement.textContent.trim() : null;

            // Returns Info
            const returnsInfoFeature_feature_divElement = doc.getElementById('returnsInfoFeature_feature_div');
            buyboxData.returnsInfo = returnsInfoFeature_feature_divElement ? returnsInfoFeature_feature_divElement.textContent.trim() : null;

            // Used Accordion Caption (Info about used offers if available)
            const usedAccordionCaption_feature_divElement = doc.getElementById('usedAccordionCaption_feature_div');
            buyboxData.usedCaption = usedAccordionCaption_feature_divElement ? usedAccordionCaption_feature_divElement.textContent.trim() : null;


            return buyboxData;
        } catch (error) {
            console.error("Error in extractBuyboxInfo:", error);
            return {};
        }
    }

    async function scrapeProductTitle(doc) { // Modified to only extract title
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const productTitleElement = doc.getElementById('productTitle');
            const productTitle = productTitleElement ? productTitleElement.innerText.trim() : null;
            return { productTitle: productTitle }; // Only return title
        } catch (error) {
            console.error("Error in scrapeProductTitle:", error);
            return { productTitle: null }; // Only return null title on error
        }
    }


    function extractOverviewBrand(doc) {
        try {
            const productOverviewDiv = doc.getElementById('productOverview_feature_div');
            if (!productOverviewDiv) return { productDetails: null, overviewAsin: null, overviewProductType: null };
            const productDetails = {};
            let overviewAsin = null;
            let overviewProductType = null;

            const rows = productOverviewDiv.querySelectorAll('table tr');
            rows.forEach(row => {
                const attributeNameElement = row.querySelector('td.a-span3 .a-text-bold');
                const attributeValueElement = row.querySelector('td.a-span9 .po-break-word');
                if (attributeNameElement && attributeValueElement) {
                    let attributeName = attributeNameElement.textContent.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '').trim();
                    attributeName = attributeName.toLowerCase().split(' ').map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join('');
                    productDetails[attributeName] = attributeValueElement.textContent.trim();
                }
            });
            const scriptOverview = productOverviewDiv.querySelector('script[type="text/javascript"]');
            if (scriptOverview) {
                const asinMatch = scriptOverview.textContent.match(/metricParameters\.asin = '([^']+)';/);
                const productTypeMatch = scriptOverview.textContent.match(/metricParameters\.productType = '([^']+)';/);
                overviewAsin = asinMatch ? asinMatch[1] : null;
                overviewProductType = productTypeMatch ? productTypeMatch[1] : null;
            }
            return { productDetails, overviewAsin, overviewProductType };
        } catch (error) {
            console.error("Error in extractOverviewBrand:", error);
            return { productDetails: null, overviewAsin: null, overviewProductType: null };
        }
    }

    function extractProductInformation(doc) { // Replaces extractProductDetailsExpanded and extractTechnicalDetails
        try {
            const productDetailsDiv = doc.getElementById('productDetails2_feature_div') || doc.getElementById('prodDetails');
            if (!productDetailsDiv) return {};

            const productInfo = {};

            // Technical Details
            const technicalDetailsTable = productDetailsDiv.querySelector('#productDetails_techSpec_section_1.prodDetTable');
            if (technicalDetailsTable) {
                productInfo.technicalDetails = {};
                const rows = technicalDetailsTable.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const headerCell = row.querySelector('th.prodDetSectionEntry');
                    const valueCell = row.querySelector('td.prodDetAttrValue');
                    if (headerCell && valueCell) {
                        const header = headerCell.textContent.trim();
                        const value = valueCell.textContent.trim();
                        productInfo.technicalDetails[header] = value;
                    }
                });
            }

            // Additional Information
            const additionalInfoTable = productDetailsDiv.querySelector('#productDetails_detailBullets_sections1.prodDetTable');
            if (additionalInfoTable) {
                productInfo.additionalInformation = {};
                const rows = additionalInfoTable.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const headerCell = row.querySelector('th.prodDetSectionEntry');
                    const valueCell = row.querySelector('td.prodDetAttrValue');
                    if (headerCell && valueCell) {
                        const header = headerCell.textContent.trim();
                        const value = valueCell.textContent.trim();
                        productInfo.additionalInformation[header] = value;
                    }
                });
            }

            return productInfo;

        } catch (error) {
            console.error("Error in extractProductInformation:", error);
            return {};
        }
    }


    function extractWhatsInBox(doc) {
        try {
            console.log("Executing extractWhatsInBox...");
            const whatsInTheBoxDiv = doc.getElementById('postPurchaseWhatsInTheBox_MP_feature_div');
            console.log("whatsInTheBoxDiv:", whatsInTheBoxDiv); // Log the element
            if (!whatsInTheBoxDiv) {
                console.log("whatsInTheBoxDiv not found, returning empty object.");
                return {};
            }
            const whatsInTheBox = {};
            const heading = whatsInTheBoxDiv.querySelector('h2');
            console.log("  heading:", heading); // Log heading
            if (heading) whatsInTheBox.heading = heading.textContent.trim();
            const listItems = whatsInTheBoxDiv.querySelectorAll('#witb-content-list li.postpurchase-included-components-list-item span.a-list-item');
            console.log("  listItems:", listItems); // Log listItems
            whatsInTheBox.items = Array.from(listItems).map(item => item.textContent.trim());
            console.log("Extracted whatsInBox data:", whatsInTheBox);
            return whatsInTheBox;
        } catch (error) {
            console.error("Error in extractWhatsInBox:", error);
            return {};
        }
    }

    // --- Fetch and Extract All Offers Function --- (Includes Updated Price Extraction Logic)
    async function fetchAndExtractAllOffers(mainOffersUrl, page2OffersUrl) {
        let allOffersData = { pinnedOffer: null, offers: [], otherOptions: null };
        let mainPageOffers = null;


         function extractOffersFromDocument(doc, pageNumber) {
        try {
            let aodContainer;
            if (pageNumber === 1) {
                 aodContainer = doc.getElementById('aod-container');
                 if (!aodContainer) {
                    console.log(`aod-container not found in fetched AJAX content for page ${pageNumber}.`);
                    return null;
                }
            }


            const offers = [];
            let pinnedOfferData = null;

            if (pageNumber === 1) {
                const pinnedOfferBlock = doc.getElementById('aod-pinned-offer');
                if (pinnedOfferBlock) {
                    pinnedOfferData = {};

                    const conditionElement = pinnedOfferBlock.querySelector('#aod-offer-heading .a-text-bold');
                    if (conditionElement) pinnedOfferData.condition = conditionElement.textContent.trim();

                    const priceBlockElement = pinnedOfferBlock.querySelector('#aod-price-0');
                    if (priceBlockElement) {
                        pinnedOfferData.priceDetails = {};
                        const offscreenPricePinned = priceBlockElement.querySelector('span.aok-offscreen');
                        if (offscreenPricePinned) {
                            const priceText = offscreenPricePinned.textContent.trim();
                            const priceMatch = priceText.match(/£?([\d,.]+)/);
                            pinnedOfferData.priceDetails.offerPrice = priceMatch ? priceMatch[1] : priceText;
                        }

                        const discountElement = priceBlockElement.querySelector('.a-size-medium.a-color-price.aok-align-center.centralizedApexPriceSavingsPercentageMargin');
                        if (discountElement) pinnedOfferData.priceDetails.discountPercentage = discountElement.textContent.trim();

                        const rrpElement = priceBlockElement.querySelector('.a-size-small.a-color-secondary.aok-align-center span span .a-offscreen');
                        if (rrpElement) pinnedOfferData.priceDetails.rrp = rrpElement.textContent.trim();
                    }


                    const deliveryPromiseElement = pinnedOfferBlock.querySelector('.aod-delivery-promise > span.a-color-base');
                    if (deliveryPromiseElement) pinnedOfferData.deliveryPromise = deliveryPromiseElement.textContent.trim();

                    const deliveryInfoElementPinned = pinnedOfferBlock.querySelector('.aod-delivery-promise-column .a-unified-delivery');
                    if (deliveryInfoElementPinned) {
                        pinnedOfferData.deliveryInformation = {};

                        const freeDeliveryElement = deliveryInfoElementPinned.querySelector('#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE span');
                        if (freeDeliveryElement) {
                            pinnedOfferData.deliveryInformation.freeDeliveryText = freeDeliveryElement.textContent.trim();
                            pinnedOfferData.deliveryInformation.freeDeliveryDetailsLink = freeDeliveryElement.querySelector('a[aria-label="Details about delivery costs and delivery methods"]')?.href || null;
                        }

                        const fastestDeliveryElement = deliveryInfoElementPinned.querySelector('#mir-layout-DELIVERY_BLOCK-slot-SECONDARY_DELIVERY_MESSAGE_LARGE span');
                        if (fastestDeliveryElement) {
                            pinnedOfferData.deliveryInformation.fastestDeliveryText = fastestDeliveryElement.textContent.trim();
                            pinnedOfferData.deliveryInformation.fastestDeliveryDetailsLink = fastestDeliveryElement.querySelector('a[aria-label="Details about delivery costs and delivery methods"]')?.href || null;
                            const cutoffTimeElement = fastestDeliveryElement.querySelector('#ftCountdown');
                            if (cutoffTimeElement) pinnedOfferData.deliveryInformation.fastestDeliveryCutoff = cutoffTimeElement.textContent.trim();
                        }
                    }


                    const shipsFromElement = pinnedOfferBlock.querySelector('#aod-offer-shipsFrom .a-size-small.a-color-base');
                    if (shipsFromElement) pinnedOfferData.shipsFrom = shipsFromElement.textContent.trim();

                    const soldByElement = pinnedOfferBlock.querySelector('#aod-offer-soldBy .a-size-small.a-color-base');
                    if (soldByElement) pinnedOfferData.soldBy = soldByElement.textContent.trim();

                    const sellerRating = {};
                    const ratingIcon = pinnedOfferBlock.querySelector('.aod-offer-seller-rating i.a-icon-star-mini');
                    const ratingTextElement = pinnedOfferBlock.querySelector('.aod-offer-seller-rating .a-size-small.a-color-base');
                    if (ratingIcon) {
                        const ariaLabel = ratingIcon.querySelector('.a-icon-alt');
                        if (ariaLabel) sellerRating.ratingText = ariaLabel.textContent.trim();
                    }
                    if (ratingTextElement) sellerRating.ratingDetails = ratingTextElement.textContent.trim();
                    if (Object.keys(sellerRating).length > 0) pinnedOfferData.sellerRating = sellerRating;

                    const productTitleElement = pinnedOfferBlock.querySelector('#aod-asin-title-text');
                    if (productTitleElement) pinnedOfferData.productTitle = productTitleElement.textContent.trim();
                }
            }


            const offerBlocks = aodContainer ? aodContainer.querySelectorAll('#aod-offer') : doc.querySelectorAll('#aod-offer');
            offerBlocks.forEach(offerBlock => {
                const offerData = {};

                const conditionElement = offerBlock.querySelector('#aod-offer-heading .a-text-bold');
                if (conditionElement) offerData.condition = conditionElement.textContent.trim();

                // --- Updated Price Extraction Logic (using aod-offer-price and aok-offscreen) ---
                const priceContainer = offerBlock.querySelector('#aod-offer-price');
                let offerPrice = null;
                if (priceContainer) {
                    const offscreenPrice = priceContainer.querySelector('.aok-offscreen');
                    if (offscreenPrice) {
                        offerPrice = offscreenPrice.textContent.trim();
                    }  else {
                        // Fallback to previous logic if aok-offscreen is not found (less likely)
                        const priceElement = priceContainer.querySelector('.a-price');
                        if (priceElement) {
                            const offscreenPriceFallback = priceElement.querySelector('.a-offscreen'); // check for nested offscreen price
                            if (offscreenPriceFallback) offerPrice = offscreenPriceFallback.textContent.trim();
                            else { // if still not found, parse price components
                                const whole = priceElement.querySelector('.a-price-whole');
                                const fraction = priceElement.querySelector('.a-price-fraction');
                                const symbol = priceElement.querySelector('.a-price-symbol');
                                if (whole && fraction) offerPrice = `${symbol ? symbol.textContent.trim() : ''}${whole.textContent.trim()}${fraction.textContent.trim()}`;
                            }
                        }
                    }
                }
                offerData.price = offerPrice;
                // --- End Updated Price Extraction Logic ---


                const deliveryPromiseElement = offerBlock.querySelector('.aod-delivery-promise > span.a-color-base');
                if (deliveryPromiseElement) offerData.deliveryPromise = deliveryPromiseElement.textContent.trim();

                const deliveryInfoElementOffer = offerBlock.querySelector('.aod-delivery-promise-column .a-unified-delivery');
                if (deliveryInfoElementOffer) {
                    offerData.deliveryInformation = {};
                    const freeDeliveryElement = deliveryInfoElementOffer.querySelector('#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE span');
                    if (freeDeliveryElement) offerData.deliveryInformation.freeDeliveryText = freeDeliveryElement.textContent.trim();
                }


                const shipsFromElement = offerBlock.querySelector('#aod-offer-shipsFrom .a-size-small.a-color-base');
                if (shipsFromElement) offerData.shipsFrom = shipsFromElement.textContent.trim();

                const soldByElement = offerBlock.querySelector('#aod-offer-soldBy .a-link-normal');
                if (soldByElement) {
                    offerData.soldBy = soldByElement.textContent.trim();
                    offerData.soldByLink = soldByElement.href;
                }

                const sellerRating = {};
                const ratingIcon = offerBlock.querySelector('.aod-offer-seller-rating i.a-icon-star-mini');
                const ratingTextElement = offerBlock.querySelector('.aod-offer-seller-rating .a-size-small.a-color-base');
                if (ratingIcon) {
                    const ariaLabel = ratingIcon.querySelector('.a-icon-alt');
                    if (ariaLabel) sellerRating.ratingText = ariaLabel.textContent.trim();
                }
                if (ratingTextElement) sellerRating.ratingDetails = ratingTextElement.textContent.trim();
                if (Object.keys(sellerRating).length > 0) offerData.sellerRating = sellerRating;

                offers.push(offerData);
            });


            let otherOptions = null;
            if (pageNumber === 1 && aodContainer) {
                const otherOptionsHeading = aodContainer.querySelector('#aod-filter-offer-count-string');
                const otherOptionsSorted = aodContainer.querySelector('#aod-sort-details-string');
                if (otherOptionsHeading) {
                    otherOptions = { heading: otherOptionsHeading.textContent.trim() };
                    if (otherOptionsSorted) otherOptions.sort = otherOptionsSorted.textContent.trim();
                }
            }

            return {
                pinnedOffer: pageNumber === 1 ? pinnedOfferData : null,
                offers: offers,
                otherOptions: pageNumber === 1 ? otherOptions : null
            };
        } catch (error) {
            console.error("Error in extractOffersFromDocument:", error);
            return null;
        }
    }


        try {

            console.log("Fetching Main Offers Page (Page 1)...");
            const mainResponse = await fetch(mainOffersAjaxURL);
            if (!mainResponse.ok) {
                throw new Error(`HTTP error fetching main offers page (Page 1)! status: ${mainResponse.status}`);
            }
            const mainHTMLText = await mainResponse.text();
            const mainParsedDoc = parser.parseFromString(mainHTMLText, 'text/html');

            mainPageOffers = extractOffersFromDocument(mainParsedDoc, 1);
            if (mainPageOffers) {
                allOffersData = {
                    pinnedOffer: mainPageOffers.pinnedOffer,
                    offers: mainPageOffers.offers,
                    otherOptions: mainPageOffers.otherOptions
                };
            }


            if (mainPageOffers) {
                console.log("Fetching Page 2 Offers...");
                try {
                    const page2Response = await fetch(page2OffersAjaxURL);
                    if (!page2Response.ok) {
                        console.warn(`HTTP error fetching page 2 offers! status: ${page2Response.status}. Page 2 offers will be skipped.`);
                        return allOffersData;
                    }
                    const page2HTMLText = await page2Response.text();
                    const page2ParsedDoc = parser.parseFromString(page2HTMLText, 'text/html');

                    const page2Offers = extractOffersFromDocument(page2ParsedDoc, 2);
                    if (page2Offers) {
                        allOffersData.offers = allOffersData.offers.concat(page2Offers.offers);
                    }
                } catch (errorPage2) {
                    console.warn("Error fetching or processing Page 2 Offers:", errorPage2);
                    console.warn("Page 2 offers will be skipped.");
                    return allOffersData;
                }
            } else {
                console.log("Skipping Page 2 Offers fetch because Main Offers Page extraction failed.");
            }


            return allOffersData;

        } catch (error) {
            console.error("Error fetching or parsing AJAX content:", error);
            return null;
        }
    }


    // ---  Run the combined scraper function!  ---
    scrapeProductPage(productURL, mainOffersAjaxURL, page2OffersAjaxURL).then(allData => {
        if (allData) {
            console.log("--- Full Product Data Extraction Complete! ---");
            console.log("Final Combined Data Output:", allData);
        } else {
            console.error("Full Product Data Extraction Failed.");
        }
    });

    const parser = new DOMParser();

})();