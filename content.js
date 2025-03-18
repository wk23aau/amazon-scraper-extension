(function() {
    console.log("Amazon ASIN and Review Extractor content script loaded.");

    function extractAsins() {
        const asinElements = document.querySelectorAll('div[data-asin]');
        const asins = [];
        asinElements.forEach(element => {
            const asin = element.getAttribute('data-asin');
            if (asin) {
                asins.push(asin);
            }
        });
        return asins;
    }

    async function fetchReviewPage(asin, reviewType, pageUrl, accumulatedReviews) {
        const filterType = reviewType === 'critical' ? 'critical' : 'all_reviews';

        if (!pageUrl) {
            pageUrl = `https://www.amazon.com/product-reviews/${asin}/ref=cm_cr_arp_d_paging_btm_next_1?ie=UTF8&reviewerType=all_reviews&filterByStar=${filterType}&pageNumber=1`;
        }
        if (!accumulatedReviews) {
            accumulatedReviews = [];
        }

        let currentPageNumber = 1;
        try {
            const urlParams = new URLSearchParams(new URL(pageUrl).search);
            const pageNumberParam = urlParams.get('pageNumber');
            if (pageNumberParam) {
                currentPageNumber = parseInt(pageNumberParam, 10);
            }
        } catch (error) {
            console.warn(`Could not parse pageNumber from URL: ${pageUrl}`, error);
        }

        console.log(`[DEBUG] START fetchReviewPage - ${reviewType} - Page ${currentPageNumber} - URL: ${pageUrl}`);

        try {
            const response = await fetch(pageUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for URL: ${pageUrl} (AJAX)`);
            }
            const reviewHtml = await response.text();
            const parsedReviews = parseReviewsFromHtmlFragment(reviewHtml);
            accumulatedReviews.push(...parsedReviews);
            console.log(`[DEBUG] Parsed ${parsedReviews.length} ${reviewType} reviews from page ${currentPageNumber} (AJAX), Total accumulated: ${accumulatedReviews.length}`);

            const nextPageLinkHref = findNextPageLinkHrefFromFragment(reviewHtml);

            if (nextPageLinkHref) {
                const nextPageUrl = new URL(nextPageLinkHref, pageUrl).href;
                console.log(`[DEBUG] Next page URL found in AJAX response: ${nextPageUrl}`);
                return fetchReviewPage(asin, reviewType, nextPageUrl, accumulatedReviews);
            } else {
                console.log(`[DEBUG] No more ${reviewType} review pages found for ASIN: ${asin} (AJAX). Total ${reviewType} reviews: ${accumulatedReviews.length}`);
                return { accumulatedReviews: accumulatedReviews, reviewHtml: reviewHtml };
            }

        } catch (error) {
            console.error(`[DEBUG] ERROR in fetchReviewPage - ${reviewType} - Page ${currentPageNumber} - URL: ${pageUrl}`, error);
            return { accumulatedReviews: accumulatedReviews, reviewHtml: null };
        } finally {
            console.log(`[DEBUG] END fetchReviewPage - ${reviewType} - Page ${currentPageNumber} - URL: ${pageUrl}`);
        }
    }

    function parseReviewsFromHtmlFragment(htmlFragment) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlFragment, 'text/html');
        let reviews = [];

        const reviewElements = doc.querySelectorAll('#cm_cr-review_list [data-hook="review"]');
        reviewElements.forEach(reviewElement => {
            const review = {};
            review.reviewerName = reviewElement.querySelector('[data-hook="review-author"]')?.textContent.trim() ?? null;
            const ratingElement = reviewElement.querySelector('[data-hook="review-star-rating"]');
            if (ratingElement) {
                const ratingText = ratingElement.querySelector('.a-icon-alt').textContent.trim();
                const ratingMatch = ratingText.match(/(\d[,.]\d)/);
                review.rating = ratingMatch ? parseFloat(ratingMatch[1].replace(",", ".")) : null;
            }
            review.title = reviewElement.querySelector('[data-hook="review-title"]')?.textContent.trim() ?? null;
            review.date = reviewElement.querySelector('[data-hook="review-date"]')?.textContent.trim() ?? null;
            review.body = reviewElement.querySelector('[data-hook="review-body"]')?.textContent.trim() ?? null;
            const helpfulVotesElement = reviewElement.querySelector('[data-hook="helpful-vote-statement"]');
            if (helpfulVotesElement) {
                const helpfulVotesText = helpfulVotesElement.textContent.trim();
                const helpfulVotesMatch = helpfulVotesText.match(/(\d+|One)/);
                review.helpfulVotes = helpfulVotesMatch ? ((helpfulVotesMatch[1] === "One") ? 1 : parseInt(helpfulVotesMatch[1], 10)) : null;
            }
            reviews.push(review);
        });
        console.log(`[DEBUG] parseReviewsFromHtmlFragment - Parsed ${reviews.length} reviews from fragment`);
        return reviews;
    }

    function findNextPageLinkHrefFromFragment(htmlFragment) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlFragment, 'text/html');
        const nextPageElement = doc.querySelector('.a-pagination .a-last:not(.a-disabled) a');
        const nextPageHref = nextPageElement ? nextPageElement.getAttribute('href') : null;
        console.log(`[DEBUG] findNextPageLinkHrefFromFragment - Next Page Href: ${nextPageHref}`);
        return nextPageHref;
    }

    function findNextPageLinkHref(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const nextPageElement = doc.querySelector('.a-pagination .a-last:not(.a-disabled) a');
        return nextPageElement ? nextPageElement.getAttribute('href') : null;
    }

    async function sendReviewsToServer(asin, allReviews, criticalReviews, productDetailsHtml, reviewHtml, aodMainProductDetailsHtml, aodSellerInfoHtml) {
        const serverUrl = 'http://localhost:3000/save-reviews';

        try {
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    asin: asin,
                    allReviews: allReviews,
                    criticalReviews: criticalReviews,
                    productDetailsHtml: productDetailsHtml,
                    reviewHtml: reviewHtml,
                    aodMainProductDetailsHtml: aodMainProductDetailsHtml,
                    aodSellerInfoHtml: aodSellerInfoHtml
                })
            });

            if (!response.ok) {
                throw new Error(`Server HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(`Server response for ASIN ${asin}:`, responseData);

        } catch (error) {
            console.error(`Error sending reviews to server for ASIN ${asin}:`, error);
        }
    }

    async function fetchProductDetailsPage(asin) {
        const productDetailsUrl = `https://www.amazon.com/dp/${asin}/`;
        console.log(`[DEBUG] Fetching product details page: ${productDetailsUrl}`);

        try {
            const response = await fetch(productDetailsUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for product details page URL: ${productDetailsUrl}`);
            }
            const productDetailsHtml = await response.text();
            console.log(`[DEBUG] Product details page fetched successfully for ASIN: ${asin}`);
            return productDetailsHtml;
        } catch (error) {
            console.error(`[DEBUG] Error fetching product details page for ASIN ${asin}:`, error);
            return null;
        }
    }

    async function fetchAodMainProductDetailsPage(asin) {
        const aodMainProductDetailsUrl = `https://www.amazon.com/gp/product/ajax/ref=dp_aod_ALL_mbc?asin=${asin}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&experienceId=aodAjaxMain`;
        console.log(`[DEBUG] Fetching AOD Main Product Details page: ${aodMainProductDetailsUrl}`);

        try {
            const response = await fetch(aodMainProductDetailsUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for AOD Main Product Details page URL: ${aodMainProductDetailsUrl}`);
            }
            const aodMainProductDetailsHtml = await response.text();
            console.log(`[DEBUG] AOD Main Product Details page fetched successfully for ASIN: ${asin}`);
            return aodMainProductDetailsHtml;
        } catch (error) {
            console.error(`[DEBUG] Error fetching AOD Main Product Details page for ASIN ${asin}:`, error);
            return null;
        }
    }

    async function fetchAodSellerInfoPage(asin, pageNumber = 1) {
        const aodSellerInfoUrl = `https://www.amazon.com/gp/product/ajax/ref=aod_page_${pageNumber}?asin=${asin}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&isonlyrenderofferlist=true&pageno=${pageNumber}&experienceId=aodAjaxMain`;
        console.log(`[DEBUG] Fetching AOD Seller Info page ${pageNumber}: ${aodSellerInfoUrl}`);

        try {
            const response = await fetch(aodSellerInfoUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for AOD Seller Info page ${pageNumber} URL: ${aodSellerInfoUrl}`);
            }
            const aodSellerInfoHtml = await response.text();
            console.log(`[DEBUG] AOD Seller Info page ${pageNumber} fetched successfully for ASIN: ${asin}`);
            return aodSellerInfoHtml;
        } catch (error) {
            console.error(`[DEBUG] Error fetching AOD Seller Info page ${pageNumber} for ASIN ${asin}:`, error);
            return null;
        }
    }


    async function fetchAllReviewTypesForAsin(asin) {
        console.log(`Fetching all review types for ASIN: ${asin}`);
        const allReviewsData = await fetchReviewPage(asin, 'all');
        const criticalReviewsData = await fetchReviewPage(asin, 'critical');

        return {
            allReviews: allReviewsData.accumulatedReviews,
            criticalReviews: criticalReviewsData.accumulatedReviews,
            reviewHtml: allReviewsData.reviewHtml
        };
    }

    async function processAsin(asin) {
        console.log(`Processing ASIN: ${asin}`);
        const reviewData = await fetchAllReviewTypesForAsin(asin);
        const allReviews = reviewData.allReviews;
        const criticalReviews = reviewData.criticalReviews;
        const reviewHtml = reviewData.reviewHtml;

        const productDetailsHtml = await fetchProductDetailsPage(asin);
        const aodMainProductDetailsHtml = await fetchAodMainProductDetailsPage(asin);
        const aodSellerInfoHtml = await fetchAodSellerInfoPage(asin);

        if ((allReviews && allReviews.length > 0) || (criticalReviews && criticalReviews.length > 0) || productDetailsHtml || reviewHtml || aodMainProductDetailsHtml || aodSellerInfoHtml) {
            console.log(`Sending reviews and product details to server for ASIN: ${asin}`);
            await sendReviewsToServer(asin, allReviews, criticalReviews, productDetailsHtml, reviewHtml, aodMainProductDetailsHtml, aodSellerInfoHtml);
        } else {
            console.log(`No reviews or product details found or fetched for ASIN: ${asin}`);
        }
    }

    function main() {
        const asins = extractAsins();
        console.log("Extracted ASINs:", asins);

        if (asins.length > 0) {
            console.log("Fetching and sending review pages and product details to server...");
            asins.forEach(asin => {
                processAsin(asin);
            });
        } else {
            console.log("No ASINs found on this page.");
        }
    }

    main();

})();