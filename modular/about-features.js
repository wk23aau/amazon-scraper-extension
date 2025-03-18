(function() { // IIFE for scope isolation

    const featureBulletsDiv = document.getElementById('featurebullets_feature_div');

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

    console.log('"About this item" Text:', aboutThisItemText);
    console.log("Features:", features);

})();