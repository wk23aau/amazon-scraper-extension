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

        const navSubnavDiv = parsedDoc.getElementById('nav-subnav');

        if (!navSubnavDiv) {
            console.log("Navigation subnav section not found on fetched page.");
            return; // Exit if nav-subnav is not found
        }

        const subnavData = {
            category: null,
            subcategories: [],
            mainCategory: null
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

        console.log("Subnavigation Hierarchy (from fetched page):", subnavData);

    } catch (error) {
        console.error("Error fetching or parsing page:", error);
    }
})();
// Promise {<pending>}
// VM2588:52 Subnavigation Hierarchy (from fetched page): 
// {category: 'Computers', subcategories: Array(14), mainCategory: 'Computers & Accessories'}
// category
// : 
// "Computers"
// mainCategory
// : 
// "Computers & Accessories"
// subcategories
// : 
// Array(14)
// 0
// : 
// "Best Sellers"
// 1
// : 
// "Deals"
// 2
// : 
// "Laptops"
// 3
// : 
// "Desktops"
// 4
// : 
// "Printers"
// 5
// : 
// "Tablets"
// 6
// : 
// "Tablet Accessories"
// 7
// : 
// "Monitors"
// 8
// : 
// "Computer Accessories"
// 9
// : 
// "Components"
// 10
// : 
// "Networking"
// 11
// : 
// "Memory & Storage"
// 12
// : 
// "Gaming Store"
// 13
// : 
// "Amazon Business"