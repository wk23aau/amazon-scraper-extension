// content_reviews.js

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Review Data Function, contentReviews logic does the all logic here.
async function scrapeReviews(asin,criticalOnly = false) {

   let reviews = [];
    let reviewCount = 0; //init local review variable... avoid global
   let reviewAvgRating = null; //local review average

  const reviewCountElement = document.querySelector('[data-hook="cr-filter-info-review-count"]');

    if (reviewCountElement) {
        const reviewCountMatch = reviewCountElement.textContent.match(/(\d[\d,.]*)/);

            if (reviewCountMatch) {
               reviewCount = parseInt(reviewCountMatch[1].replace(/[,.]/g, ''), 10); //always; when set here.

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

      let pageNumber = 1;

 while (hasNextReviewPage) { //pagination we could add review logic,
         if(!document.querySelector('#cm_cr-review_list [data-hook="review"]')){ //
           break;
           } //check this with: while loops!

        const reviewElements = document.querySelectorAll('#cm_cr-review_list [data-hook="review"]'); //

     for (const reviewElement of reviewElements) {
     const review = {};  //current parsed review as
      review.reviewerName = reviewElement.querySelector('[data-hook="review-author"]')?.textContent.trim() ?? null;
        //review: always a-star
         //a tag here: not; as "out of 5 stars, out of... should give some text..." but span

        const ratingElement = reviewElement.querySelector('[data-hook="review-star-rating"]');

          if (ratingElement) {

           const ratingText = ratingElement.querySelector('.a-icon-alt').textContent.trim();
  const ratingMatch = ratingText.match(/(\d[,.]\d)/); //match; values, . or different locale num
  review.rating = ratingMatch ? parseFloat(ratingMatch[1].replace(",", ".")) : null; //from reviews; get 1.2.3... 2
         }


 const reviewTitleElement = reviewElement.querySelector('[data-hook="review-title"]'); //for review

           if (reviewTitleElement) { //
      const titleSpan = reviewTitleElement.querySelector('span:nth-child(3)');

               if (titleSpan) { //no tab; but await and new fetch.

               review.title = titleSpan.textContent.trim();
                  }
             }

     review.date = reviewElement.querySelector('[data-hook="review-date"]')?.textContent.trim() ?? null; //data
     review.body = reviewElement.querySelector('[data-hook="review-body"]')?.textContent.trim() ?? null;
 //
       const helpfulVotesElement = reviewElement.querySelector('[data-hook="helpful-vote-statement"]');

         if (helpfulVotesElement) { //keep; parsing and review here.

           const helpfulVotesText = helpfulVotesElement.textContent.trim();
         //for critical we may use type filter.
          const helpfulVotesMatch = helpfulVotesText.match(/(\d+|One)/);
           review.helpfulVotes = helpfulVotesMatch ? ((helpfulVotesMatch[1] === "One") ? 1 : parseInt(helpfulVotesMatch[1], 10)) : null;

               }

        reviews.push(review);
    }

     const nextReviewButton = document.querySelector('.a-pagination .a-last:not(.a-disabled) a'); //not a disabled and "a".

    if (nextReviewButton) { //always has page

     nextReviewButton.click(); //to navigate

          //we; may: we send as keep the pages; review-fetchs now:

      await delay(1500); //as 1 seconds and go fetch next for reviews as background tabs, they work perfect async-wait on background tabs.
       let progress; //
       } else {

              hasNextReviewPage = false;
       }
   } //while... pagination

       return { reviews, reviewCount, reviewAvgRating }; //review results here with all info
 }



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { //all parts on page request asin; from main pages(as content no message no background; no other asin pages like detail etc).

    if (request.action === "getReviews") { //

         const asin = request.asin;
 scrapeReviews(asin)  //critical rewviews also set in context scripts, not reviews(in previous responses);
   .then(data => {
       chrome.runtime.sendMessage({action: "reviewData",data}); //send review as Promise.
   }) .catch(error => {  //that background get
        console.error("Error in scrapeReviews:", error);

         }); //add reviews.
         }

 });