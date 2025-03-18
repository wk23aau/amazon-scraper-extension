(function() {
    const techDiv = document.getElementById('tech');

    if (!techDiv) {
        console.log("Tech details section not found.");
        return;
    }

    const techDetails = {};

    // --- 1. "Technical Details" Heading ---
    const heading = techDiv.querySelector('h2');
    if (heading) {
        techDetails.heading = heading.textContent.trim();
    }

     // --- 2. "AirPods 4 Active Noise Cancellation" Text ---
    const ancTextElement = techDiv.querySelector('.content-grid-block p'); // More specific selector
    if (ancTextElement) {
      techDetails.ancText = ancTextElement.textContent.trim();
    }

    // --- 3. Table Data ---
    const tables = techDiv.querySelectorAll('table.a-bordered');
    tables.forEach((table, tableIndex) => {
        const tableData = {};
        const rows = table.querySelectorAll('tr');

        rows.forEach(row => {
            const headerCell = row.querySelector('td:first-child p strong');
            const dataCell = row.querySelector('td:nth-child(2)');

            if (headerCell && dataCell) {
                let headerText = headerCell.textContent.trim();
                // Sanitize header text for use as keys
                headerText = headerText.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

                let dataText = dataCell.innerHTML.trim(); // Keep HTML for lists

                tableData[headerText] = dataText;
            }
        });
      //add index to avoid cases with same key.
        techDetails[`table_${tableIndex + 1}`] = tableData; // e.g., table_1, table_2
    });


    console.log("Technical Details:", techDetails);

})();