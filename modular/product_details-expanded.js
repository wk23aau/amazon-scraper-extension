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

        const productDetailsDiv = parsedDoc.getElementById('productDetails_feature_div');

        if (!productDetailsDiv) {
            console.log("Product Details section not found on fetched page.");
            return; // Exit if productDetailsDiv is not found
        }

        const productDetails = {};

        // --- 1. "Product information" Heading ---
        const heading = productDetailsDiv.querySelector('h1.a-text-bold');
        if (heading) {
            productDetails.heading = heading.textContent.trim();
        }

        // --- 2. Extract Table Data ---
        const expanderSections = productDetailsDiv.querySelectorAll('.a-expander-container');

        expanderSections.forEach((section, sectionIndex) => {
            const sectionTitleElement = section.querySelector('.a-expander-prompt');
            //get the table
            const table = section.querySelector('table.prodDetTable');

            if (sectionTitleElement && table) {
                let sectionTitle = sectionTitleElement.textContent.trim();
                // Sanitize section title for use as a key
                sectionTitle = sectionTitle.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

                const tableData = {};
                const rows = table.querySelectorAll('tr');

                rows.forEach(row => {
                    const headerCell = row.querySelector('th.prodDetSectionEntry');
                    const dataCell = row.querySelector('td.prodDetAttrValue');

                    if (headerCell && dataCell) {
                        let headerText = headerCell.textContent.trim();
                        // Sanitize header text for object keys
                        headerText = headerText.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
                        const dataText = dataCell.textContent.trim();
                        tableData[headerText] = dataText;
                    }
                });
                //add section title to avoid colisions
                productDetails[`${sectionTitle}`] = tableData; // Use section title as key
            }
        });
          // --- 3. Warranty & Support ---
        const warrantySection = productDetailsDiv.querySelector('#productSpecifications_dp_warranty_and_support');
        if(warrantySection)
        {
          const warrantyHeading = warrantySection.querySelector('h3');
          const warrantyText = warrantySection.querySelector('.table-padding');
           if (warrantyHeading && warrantyText)
           {
            productDetails.warranty = {
                    heading: warrantyHeading.textContent.trim(),
                    text: warrantyText.textContent.trim()
                };
           }
        }

        console.log("Product Details (from fetched page):", productDetails);

    } catch (error) {
        console.error("Error fetching or parsing page:", error);
    }
})();
// Promise {<pending>}
// VM3502:17 Product Details section not found on fetched page.