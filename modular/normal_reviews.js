// reviews_scraper.js

(async function() {  // Use an async IIFE

    let reviewsUrl = document.querySelector('a[data-hook="see-all-reviews-link-foot"]')?.href;  // Optional chaining
    if (reviewsUrl) {
        console.log("Found See All Reviews link:", reviewsUrl);
    } else {
        console.log("No 'See more reviews' link found. Scraping current page only.");
    }

    const allReviews = [];

    async function scrapeReviews(url) {
        console.log(`Scraping reviews from: ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const reviewElements = doc.querySelectorAll('li[data-hook="review"]');
            console.log(`Found ${reviewElements.length} reviews on this page`);


            for (const reviewEl of reviewElements) { // Use for...of for cleaner iteration
                const review = {};

                // Reviewer Name
                const reviewerNameElement = reviewEl.querySelector('.a-profile-name');
                review.reviewerName = reviewerNameElement ? reviewerNameElement.textContent.trim() : null;

                // Review Title - CORRECTED SELECTOR
                const reviewTitleElement = reviewEl.querySelector('[data-hook="review-title"]');
                if (reviewTitleElement) {
                    // Select the *third* span within the <a> tag
                    const titleSpan = reviewTitleElement.querySelector('span:nth-child(3)'); //THIS IS IT!
                    if (titleSpan) {
                        review.reviewTitle = titleSpan.textContent.trim();
                        console.log(`Review Title: ${review.reviewTitle}`);
                    } else {
                        console.warn("Review title span not found within", reviewTitleElement);
                        review.reviewTitle = null; // Set to null if not found
                    }
                } else {
                    console.warn("Review title <a> tag not found.");
                    review.reviewTitle = null;  // Set to null if not found
                }

                 // Review Date
                const reviewDateElement = reviewEl.querySelector('[data-hook="review-date"]');
                review.reviewDate = reviewDateElement ? reviewDateElement.textContent.trim() : null;

                // Review Text
                const reviewTextElement = reviewEl.querySelector('[data-hook="review-body"] span'); //direct text
                review.reviewText = reviewTextElement ? reviewTextElement.textContent.trim() : null;

                  //rating
                const starRatingElement = reviewEl.querySelector('[data-hook="review-star-rating"] .a-icon-alt');
                if (starRatingElement) {
                  const ratingText = starRatingElement.textContent; //e.g "4.0 out of 5 stars"
                  const ratingMatch = ratingText.match(/^(\d+\.\d+)/); // Extract the number
                  if (ratingMatch) {
                   review.rating = parseFloat(ratingMatch[1]); // Convert to number
                  }
                }

                // Helpful Votes
                const helpfulVotesElement = reviewEl.querySelector('[data-hook="helpful-vote-statement"]');
                if (helpfulVotesElement) {
                   const helpfulText = helpfulVotesElement.textContent; // "20 people found this helpful"
                   const helpfulCountMatch = helpfulText.match(/(\d+)/); // Extract the number
                   if (helpfulCountMatch) {
                        review.helpfulVotes = parseInt(helpfulCountMatch[1], 10);  //convert to number.
                    }
                }

                allReviews.push(review);
            }

            return doc;

        } catch (error) {
            console.error("Error scraping reviews:", error);
            return null; // Return null in case of an error so we can break out the while loop
        }
    }



    let currentPage = 1;
    let hasNextPage = true;

    if (!reviewsUrl) {
        // If no "See All Reviews" link, just scrape the current page.
        await scrapeReviews(window.location.href);
    } else {
        // Pagination loop
        while (hasNextPage) {
            const url = reviewsUrl + `&pageNumber=${currentPage}`;
            const doc = await scrapeReviews(url); // await the scrape

            // Check if scraping was successful before proceeding.  Important!
            if (!doc) {
                console.error("Stopping pagination due to scraping error.");
                break; // Exit the loop if there was an error.
            }

            const nextPageLink = doc.querySelector('.a-pagination li.a-last a');
            if (nextPageLink) {
                currentPage++;
                await new Promise(resolve => setTimeout(resolve, 1500)); // Keep the delay
            } else {
                hasNextPage = false; // No more pages.
            }
        }
    }


    console.log("All Reviews:", allReviews); // Log reviews *after* the loop


})();