(function() { // IIFE for scope isolation

    const brandInsightsDiv = document.getElementById('brandInsights_feature_div_3');

    const brandInsights = {};

    if (brandInsightsDiv) {
        // Get the "Top Brand" heading text
        const heading = brandInsightsDiv.querySelector('h2.a-size-medium.a-spacing-small');
        if (heading) {
            brandInsights.topBrand = heading.textContent.trim();
        }

        // Get the insight boxes
        const insightBoxes = brandInsightsDiv.querySelectorAll('.a-column .a-box.a-color-alternate-background');

        insightBoxes.forEach((box, index) => {
            const titleElement = box.querySelector('.a-text-bold');
            const descriptionElement = box.querySelector('.a-row:nth-child(2) .a-size-small'); // Select second row

            if (titleElement && descriptionElement) {
                const title = titleElement.textContent.trim();
                const description = descriptionElement.textContent.trim();

                // Use a more descriptive key based on the title
                let key = title.toLowerCase().replace(/\s+/g, '_'); // e.g., "Highly Rated" -> "highly_rated"
                if (key)
                {
                    brandInsights[key] = description;
                }

            }
        });
    }

    console.log("Brand Insights:", brandInsights);

})();