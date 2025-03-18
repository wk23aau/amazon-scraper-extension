// review_scraper.js
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
  
    console.log(`[DEBUG] START fetchReviewPage - ${reviewType} - Page ${currentPageNumber} - URL: ${pageUrl}`); // START LOG
  
    try {
      const response = await fetch(pageUrl, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'text/html, application/xhtml+xml, */*; q=0.8',
          'Referer': pageUrl
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for URL: ${pageUrl} (AJAX)`);
      }
      const htmlFragment = await response.text();
      // console.log("[DEBUG] HTML Fragment Response:", htmlFragment); // Optionally log the HTML fragment itself (can be verbose)
  
      const parsedReviews = parseReviewsFromHtmlFragment(htmlFragment);
      accumulatedReviews.push(...parsedReviews);
      console.log(`[DEBUG] Parsed ${parsedReviews.length} ${reviewType} reviews from page ${currentPageNumber} (AJAX), Total accumulated: ${accumulatedReviews.length}`);
  
      const nextPageLinkHref = findNextPageLinkHrefFromFragment(htmlFragment);
  
      if (nextPageLinkHref) {
        const nextPageUrl = new URL(nextPageLinkHref, pageUrl).href;
        console.log(`[DEBUG] Next page URL found in AJAX response: ${nextPageUrl}`);
        return fetchReviewPage(asin, reviewType, nextPageUrl, accumulatedReviews);
      } else {
        console.log(`[DEBUG] No more ${reviewType} review pages found for ASIN: ${asin} (AJAX). Total ${reviewType} reviews: ${accumulatedReviews.length}`);
        return accumulatedReviews;
      }
  
    } catch (error) {
      console.error(`[DEBUG] ERROR in fetchReviewPage - ${reviewType} - Page ${currentPageNumber} - URL: ${pageUrl}`, error); // ERROR LOG
      return accumulatedReviews;
    } finally {
      console.log(`[DEBUG] END fetchReviewPage - ${reviewType} - Page ${currentPageNumber} - URL: ${pageUrl}`); // END LOG
    }
  }
  
  // --- New function to parse reviews from HTML *fragment* ---
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
    console.log(`[DEBUG] parseReviewsFromHtmlFragment - Parsed ${reviews.length} reviews from fragment`); // DEBUG LOG in fragment parser
    return reviews;
  }
  
  // --- New function to find "Next Page" link in HTML *fragment* ---
  function findNextPageLinkHrefFromFragment(htmlFragment) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlFragment, 'text/html');
    const nextPageElement = doc.querySelector('.a-pagination .a-last:not(.a-disabled) a');
    const nextPageHref = nextPageElement ? nextPageElement.getAttribute('href') : null;
    console.log(`[DEBUG] findNextPageLinkHrefFromFragment - Next Page Href: ${nextPageHref}`); // DEBUG LOG for next page link
    return nextPageHref;
  }
  
  
  // --- Keep the original function for initial page load if needed ---
  function findNextPageLinkHref(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nextPageElement = doc.querySelector('.a-pagination .a-last:not(.a-disabled) a');
    return nextPageElement ? nextPageElement.getAttribute('href') : null;
  }
  
  
  async function fetchAllReviewTypesForAsin(asin) {
    console.log(`Fetching all review types for ASIN: ${asin}`);
    const allReviews = await fetchReviewPage(asin, 'all');
    const criticalReviews = await fetchReviewPage(asin, 'critical');
    return {
      allReviews,
      criticalReviews
    };
  }