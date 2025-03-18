// modular/all_reviews.js (No changes - still correct)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForElementMutation(element) {
    return new Promise(resolve => {
        const observer = new MutationObserver(() => {
            observer.disconnect();
            resolve();
        });
        observer.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
    });
}

async function scrapeReviews(asin, criticalOnly, signalProgress) {
    await delay(1500);
    let reviews = [];
    let reviewCount = 0;
    let reviewAvgRating = null;

    const reviewCountElement = document.querySelector('[data-hook="cr-filter-info-review-count"]');
    if (reviewCountElement) {
        const reviewCountMatch = reviewCountElement.textContent.match(/(\d[\d,.]*)/);
        if (reviewCountMatch) {
            reviewCount = parseInt(reviewCountMatch[1].replace(/[,.]/g, ''), 10);
        }
    }

    const reviewAvgRatingElement = document.querySelector('[data-hook="rating-out-of-text"]');
    if (reviewAvgRatingElement) {
        const reviewAvgRatingMatch = reviewAvgRatingElement.textContent.match(/(\d[,.]\d)/);
        if (reviewAvgRatingMatch) {
            reviewAvgRating = parseFloat(reviewAvgRatingMatch[1].replace(",", "."));
        }
    }

    let hasNextReviewPage = true;
    while (hasNextReviewPage) {
        const reviewElements = document.querySelectorAll('#cm_cr-review_list [data-hook="review"]');
        for (const reviewElement of reviewElements) {
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
        }

        const nextReviewButton = document.querySelector('.a-pagination .a-last:not(.a-disabled) a');
        if (nextReviewButton) {
            nextReviewButton.click();
            await waitForElementMutation(document.getElementById('cm_cr-review_list'));
            let progress;
            if (criticalOnly) {
                progress = 90 + Math.min(8, (reviews.length / (reviewCount * 0.1)) * 8);
            } else {
                progress = 80 + Math.min(8, (reviews.length / (reviewCount * 0.1)) * 8);
            }
            signalProgress(progress, `Scraped ${reviews.length} Reviews`); // Signal progress

        } else {
            hasNextReviewPage = false;
        }
    }
    return { reviews, reviewCount, reviewAvgRating };
}

export { scrapeReviews };