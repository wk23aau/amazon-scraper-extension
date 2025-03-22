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

      const faceoutDiv = parsedDoc.getElementById('socialProofingAsinFaceout_feature_div');

      let boughtCount = null;
      let boughtPeriod = null;

      if (faceoutDiv) {
          const titleSpan = faceoutDiv.querySelector('#social-proofing-faceout-title-tk_bought .a-text-bold');
          const periodSpan = faceoutDiv.querySelector('#social-proofing-faceout-title-tk_bought span:not(.a-text-bold)');
          if (titleSpan) {
              boughtCount = titleSpan.textContent.trim().match(/^\d+(?:\.\d+)?K?\+?/)[0]; // Extract number, optional decimal, optional K, optional +
          }
          if(periodSpan){
            boughtPeriod = periodSpan.textContent.trim();
          }
      }

      console.log("Bought Count (from fetched page):", boughtCount);
      console.log("Bought Period (from fetched page):", boughtPeriod);

  } catch (error) {
      console.error("Error fetching or parsing page:", error);
  }
})();

// Promise {<pending>}
// VM2073:30 Bought Count (from fetched page): 500+
// VM2073:31 Bought Period (from fetched page): in past month