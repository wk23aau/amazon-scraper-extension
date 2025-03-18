(function() {
    const navSubnavDiv = document.getElementById('nav-subnav');

    if (!navSubnavDiv) {
        console.log("Navigation subnav section not found.");
        return;
    }

    const subnavData = {
        category: null,
        subcategories: []
    };

    // --- 1. Category ---
    const category = navSubnavDiv.dataset.category;
    if (category) {
        // Clean up the category name
        subnavData.category = category.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // --- 2. Subcategories (just the text labels) ---
    const linkElements = navSubnavDiv.querySelectorAll('a.nav-a:not(.nav-b)'); // Exclude the main category link

    linkElements.forEach(link => {
        const subcategoryText = link.querySelector('.nav-a-content')?.textContent.trim();
        if (subcategoryText) {
            subnavData.subcategories.push(subcategoryText);
        }
    });

    // --- 3. Main Category ---
     const mainLink = navSubnavDiv.querySelector('a.nav-a.nav-b');
    if(mainLink){
      subnavData.mainCategory =  mainLink.querySelector('.nav-a-content')?.textContent.trim();
    }

    console.log("Subnavigation Hierarchy:", subnavData);

})();