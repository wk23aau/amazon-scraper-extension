(async function() {
    const productURL = 'https://www.amazon.co.uk/dp/B0CPPTNL8D';

    try {
        const response = await fetch(productURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlText = await response.text();

        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(htmlText, 'text/html');

        const featureBulletsDiv = parsedDoc.getElementById('featurebullets_feature_div');

        const features = [];
        let aboutThisItemText = null;

        if (featureBulletsDiv) {
            // Get the "About this item" heading text
            const heading = featureBulletsDiv.querySelector('h2.a-size-base-plus.a-text-bold');
            if (heading) {
                aboutThisItemText = heading.textContent.trim();
            }

            const listItems = featureBulletsDiv.querySelectorAll('ul.a-unordered-list li.a-spacing-mini span.a-list-item');

            listItems.forEach(item => {
                const featureText = item.textContent.trim();
                // Remove extra spaces and asterisks, but keep sentence structure.
                const cleanedFeatureText = featureText.replace(/\s+/g, ' ').replace(/\*+/g, '*').trim();
                features.push(cleanedFeatureText);
            });
        }

        console.log('"About this item" Text (from fetched page):', aboutThisItemText);
        console.log("Features (from fetched page):", features);

    } catch (error) {
        console.error("Error fetching or parsing page:", error);
    }
})();



// "About this item" Text (from fetched page): null
// VM2020:37 Features (from fetched page): 
// (5) ['ASUS Chromebook CX1 is made for boosting productiv…g more fun while on the move — all day, every day', '14 inch Full HD display', '4GB RAM + 64GB eMMC for ample storage', 'Google Assistant voice-recognition support', 'Operating System is Google Chrome OS']
// 0
// : 
// "ASUS Chromebook CX1 is made for boosting productivity and having more fun while on the move — all day, every day"
// 1
// : 
// "14 inch Full HD display"
// 2
// : 
// "4GB RAM + 64GB eMMC for ample storage"
// 3
// : 
// "Google Assistant voice-recognition support"
// 4
// : 
// "Operating System is Google Chrome OS"