(async function() {
  const productURL = 'https://www.amazon.co.uk/dp/B0CPPTNL8D'; // Or any Amazon product URL you want to test

  try {
      const response = await fetch(productURL);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const htmlText = await response.text();

      const parser = new DOMParser();
      const parsedDoc = parser.parseFromString(htmlText, 'text/html');

      const productOverviewDiv = parsedDoc.getElementById('productOverview_feature_div');

      const productDetails = {};
      let overviewAsin = null;
      let overviewProductType = null;

      if (productOverviewDiv) {
          const rows = productOverviewDiv.querySelectorAll('table tr');

          rows.forEach(row => {
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
          });
            const scriptOverview = productOverviewDiv.querySelector('script[type="text/javascript"]');

            if(scriptOverview){
                const asinMatch = scriptOverview.textContent.match(/metricParameters\.asin = '([^']+)';/);
                const productTypeMatch = scriptOverview.textContent.match(/metricParameters\.productType = '([^']+)';/);
                  overviewAsin = asinMatch ? asinMatch[1] : null;
                  overviewProductType = productTypeMatch ? productTypeMatch[1] : null;

            }
      } else {
          console.log("Product Overview section not found on fetched page.");
      }


      console.log("Product Details (from fetched page):", productDetails);
      console.log("ASIN (from Overview - fetched page):", overviewAsin);
      console.log("Product Type (from Overview - fetched page):", overviewProductType);


  } catch (error) {
      console.error("Error fetching or parsing page:", error);
  }
})();
// Promise {<pending>}
// VM3387:57 Product Details (from fetched page): {brand: 'ASUS', modelName: 'CX1400CKA-NK0380', screenSize: '14 Inches', colour: 'Silver', cpuModel: 'Celeron', …}brand: "ASUS"colour: "Silver"cpuModel: "Celeron"cpuSpeed: "2.8 GHz"graphicsCardDescription: "Integrated"modelName: "CX1400CKA-NK0380"operatingSystem: "Chrome OS"ramMemoryInstalledSize: "4 GB"screenSize: "14 Inches"specialFeature: "Light Weight"[[Prototype]]: Object
// VM3387:58 ASIN (from Overview - fetched page): B0CPPTNL8D
// VM3387:59 Product Type (from Overview - fetched page): NOTEBOOK_COMPUTER