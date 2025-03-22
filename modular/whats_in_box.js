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

        const whatsInTheBoxDiv = parsedDoc.getElementById('postPurchaseWhatsInTheBox_MP_feature_div');

        if (!whatsInTheBoxDiv) {
            console.log("What's in the box section not found on fetched page.");
            return; // Exit if whatsInTheBoxDiv is not found
        }

        const whatsInTheBox = {};

        // --- 1. "What's in the box" Heading ---
        const heading = whatsInTheBoxDiv.querySelector('h2');
        if (heading) {
            whatsInTheBox.heading = heading.textContent.trim();
        }

        // --- 2. List Items ---
        const listItems = whatsInTheBoxDiv.querySelectorAll('#witb-content-list li.postpurchase-included-components-list-item span.a-list-item');
        const items = [];

        listItems.forEach(item => {
            items.push(item.textContent.trim());
        });

        whatsInTheBox.items = items;

        console.log("What's in the box (from fetched page):", whatsInTheBox);

    } catch (error) {
        console.error("Error fetching or parsing page:", error);
    }
})();
// Promise {<pending>}
// VM5054:39 What's in the box (from fetched page): 
// {heading: "What's in the box?", items: Array(3)}
// heading
// : 
// "What's in the box?"
// items
// : 
// Array(3)
// 0
// : 
// "Laptop"
// 1
// : 
// "Charger"
// 2
// : 
// "User Manual"