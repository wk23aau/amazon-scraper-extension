// product_details_scraper.js

async function scrapeProductDetails() {
  try {
      const productOverviewDiv = document.getElementById('productOverview_feature_div');

      if (!productOverviewDiv) {
          console.warn("Product overview div not found.");
          return {
              productDetails: null,
              overviewAsin: null,
              overviewProductType: null
          }; // Return early if the main element is not found
      }

      const productDetails = {};

      const rows = productOverviewDiv.querySelectorAll('table tr');

      rows.forEach(row => {
          try {
              const attributeNameElement = row.querySelector('td.a-span3 .a-text-bold');
              const attributeValueElement = row.querySelector('td.a-span9 .po-break-word');

              if (attributeNameElement && attributeValueElement) {
                  let attributeName = attributeNameElement.textContent.trim();
                  const attributeValue = attributeValueElement.textContent.trim();

                  // Clean up attribute names
                  attributeName = attributeName.replace(/\s+/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '').trim();
                  attributeName = attributeName.toLowerCase().split(' ').map((word, index) => {
                      if (index === 0) {
                          return word;
                      }
                      return word.charAt(0).toUpperCase() + word.slice(1);
                  }).join('');

                  productDetails[attributeName] = attributeValue;
              }
          } catch (rowError) {
              console.error("Error processing row:", rowError);
          }
      });
      const scriptOverview = productOverviewDiv.querySelector('script[type="text/javascript"]');
      let overviewAsin = null;
      let overviewProductType = null;
      if (scriptOverview) {
          try {
              const asinMatch = scriptOverview.textContent.match(/metricParameters\.asin = '([^']+)';/);
              const productTypeMatch = scriptOverview.textContent.match(/metricParameters\.productType = '([^']+)';/);
              overviewAsin = asinMatch ? asinMatch[1] : null;
              overviewProductType = productTypeMatch ? productTypeMatch[1] : null;
          } catch (scriptError) {
              console.error("Error processing script:", scriptError);
          }


      }

      console.log("Product Details:", productDetails);
      console.log("ASIN (from Overview):", overviewAsin);
      console.log("Product Type (from Overview):", overviewProductType);

      return {
          productDetails,
          overviewAsin,
          overviewProductType
      };
  } catch (error) {
      console.error("Error in scrapeProductDetails:", error);
      return {
          productDetails: null,
          overviewAsin: null,
          overviewProductType: null
      };
  }
}