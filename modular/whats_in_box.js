(function() { // IIFE for scope isolation

    const whatsInTheBoxDiv = document.getElementById('postPurchaseWhatsInTheBox_MP_feature_div');

    if (!whatsInTheBoxDiv) {
        console.log("What's in the box section not found.");
        return;
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

    console.log("What's in the box:", whatsInTheBox);

})();