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

        let techDiv = parsedDoc.getElementById('tech');
        let usingProdDetailsStructure = false; // Flag to indicate which structure we are using

        if (!techDiv) {
            techDiv = parsedDoc.getElementById('prodDetails'); // Fallback to prodDetails
            if (techDiv) {
                usingProdDetailsStructure = true;
            } else {
                console.log("Technical details section not found on fetched page (using both #tech and #prodDetails).");
                return; // Exit if neither is found
            }
        }

        const techDetails = {};

        // --- 1. "Technical Details" Heading ---
        let headingElement;
        if (usingProdDetailsStructure) {
            headingElement = techDiv.querySelector('h1.a-size-medium.a-spacing-small'); // Selector for prodDetails structure
        } else {
            headingElement = techDiv.querySelector('h2'); // Original selector for #tech structure
        }

        if (headingElement) {
            techDetails.heading = headingElement.textContent.trim();
        }

         // --- 2. "AirPods 4 Active Noise Cancellation" Text (Conditional on structure - might not be relevant in prodDetails) ---
        if (!usingProdDetailsStructure) { // Only try to get ancText if using the original #tech structure
            const ancTextElement = techDiv.querySelector('.content-grid-block p'); // More specific selector
            if (ancTextElement) {
              techDetails.ancText = ancTextElement.textContent.trim();
            }
        }


        // --- 3. Table Data ---
        let tables;
        if (usingProdDetailsStructure) {
            tables = techDiv.querySelectorAll('table.a-keyvalue.prodDetTable'); // Selector for prodDetails structure
        } else {
            tables = techDiv.querySelectorAll('table.a-bordered'); // Original selector for #tech structure
        }


        tables.forEach((table, tableIndex) => {
            const tableData = {};
            const rows = table.querySelectorAll('tr');

            rows.forEach(row => {
                const headerCell = row.querySelector('th.a-color-secondary.a-size-base.prodDetSectionEntry') || row.querySelector('td:first-child p strong'); // Modified header cell selector to handle both structures
                const dataCell = row.querySelector('td.a-size-base.prodDetAttrValue') || row.querySelector('td:nth-child(2)'); // Modified data cell selector to handle both structures


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


        console.log("Technical Details (from fetched page):", techDetails);
        console.log("Using prodDetails structure:", usingProdDetailsStructure); // Indicate which structure was used

    } catch (error) {
        console.error("Error fetching or parsing page:", error);
    }
})();
// Promise {<pending>}
// VM5050:83 Technical Details (from fetched page): {heading: 'Technical Details', table_1: {…}, table_2: {…}, table_3: {…}, table_4: {…}}heading: "Technical Details"table_1: are_batteries_included: "‎Yes"audio_details: "‎Internal, Headphones"average_battery_life_in_hours: "‎12 Hours"batteries: "‎1 Lithium Ion batteries required. (included)"brand: "‎ASUS"colour: "‎Silver"computer_memory_type: "‎DDR4 SDRAM"connectivity_type: "‎Wi-Fi"form_factor: "‎Compact, Chromebook"graphics_card_description: "‎Integrated"graphics_card_interface: "‎Integrated"graphics_chipset_brand: "‎Intel"graphics_ram_type: "‎DDR4 SDRAM"guaranteed_software_updates_until: "‎unknown"hard_disk_description: "‎Emmc"hard_drive_interface: "‎Solid State"item_model_number: "‎4711387439586"item_weight: "‎1.51 kg"lithium_battery_energy_content: "‎42 Watt Hours"lithium_battery_packaging: "‎Batteries contained in equipment"lithium_battery_weight: "‎16 g"manufacturer: "‎ASUS"maximum_memory_supported: "‎4 GB"memory_clock_speed: "‎2400 MHz"memory_technology: "‎DDR4"number_of_lithium_ion_cells: "‎3"number_of_usb_30_ports: "‎2"operating_system: "‎Chrome OS"power_source: "‎Battery Powered"processor_brand: "‎Intel"processor_count: "‎2"processor_speed: "‎2.8 GHz"processor_type: "‎Celeron"product_dimensions: "‎32.26 x 1.8 x 22.8 cm; 1.51 kg"ram_size: "‎4"resolution: "‎1920x1080 Pixels"screen_resolution: "‎1920 x 1080 pixels"series: "‎CX1400CKA-NK0380"standing_screen_display_size: "‎14 Inches"wireless_type: "‎802.11bgn"[[Prototype]]: Objecttable_2: {asin: 'B0CPPTNL8D', customer_reviews: '<div id="averageCustomerReviews" data-asin="B0CPPT…\n\n           </div>\n      <br> 4.3 out of 5 stars', best_sellers_rank: '<span>  <span>1,076 in Computers &amp; Accessories…ers">Traditional Laptops</a></span> <br>  </span>', delivery_information: 'We cannot deliver certain products outside mainlan…when you enter your delivery address at checkout.', date_first_available: '7 Dec. 2023'}asin: "B0CPPTNL8D"best_sellers_rank: "<span>  <span>1,076 in Computers &amp; Accessories (<a href=\"/gp/bestsellers/computers/ref=pd_zg_ts_computers\">See Top 100 in Computers &amp; Accessories</a>)</span> <br>  <span>7 in <a href=\"/gp/bestsellers/computers/30117754031/ref=pd_zg_hrsr_computers\">Traditional Laptops</a></span> <br>  </span>"customer_reviews: "<div id=\"averageCustomerReviews\" data-asin=\"B0CPPTNL8D\" data-ref=\"dpx_acr_pop_\">\n                           <span class=\"a-declarative\" data-action=\"acrStarsLink-click-metrics\" data-acrstarslink-click-metrics=\"{}\">         <span id=\"acrPopover\" class=\"reviewCountTextLinkedHistogram noUnderline\" title=\"4.3 out of 5 stars\">\n        <span class=\"a-declarative\" data-action=\"a-popover\" data-a-popover=\"{&quot;max-width&quot;:&quot;700&quot;,&quot;closeButton&quot;:&quot;true&quot;,&quot;closeButtonLabel&quot;:&quot;Close&quot;,&quot;position&quot;:&quot;triggerBottom&quot;,&quot;popoverLabel&quot;:&quot;Customer Reviews Ratings Summary&quot;,&quot;url&quot;:&quot;/gp/customer-reviews/widgets/average-customer-review/popover/ref=dpx_acr_pop_?contextId=dpx&amp;asin=B0CPPTNL8D&quot;}\"> <a href=\"javascript:void(0)\" role=\"button\" class=\"a-popover-trigger a-declarative\">    <span class=\"a-size-base a-color-base\"> 4.3 </span>            <i class=\"a-icon a-icon-star a-star-4-5 cm-cr-review-stars-spacing-big\"><span class=\"a-icon-alt\">4.3 out of 5 stars</span></i>   <i class=\"a-icon a-icon-popover\"></i></a> </span>   <span class=\"a-letter-space\"></span>  </span>\n\n       </span> <span class=\"a-letter-space\"></span>             <span class=\"a-declarative\" data-action=\"acrLink-click-metrics\" data-acrlink-click-metrics=\"{}\"> <a id=\"acrCustomerReviewLink\" class=\"a-link-normal\" href=\"#customerReviews\">    <span id=\"acrCustomerReviewText\" class=\"a-size-base\">1,085 ratings</span>   </a> </span> <script type=\"text/javascript\">\n                    \n                    var dpAcrHasRegisteredArcLinkClickAction;\n                    P.when('A', 'ready').execute(function(A) {\n                        if (dpAcrHasRegisteredArcLinkClickAction !== true) {\n                            dpAcrHasRegisteredArcLinkClickAction = true;\n                            A.declarative(\n                                'acrLink-click-metrics', 'click',\n                                { \"allowLinkDefault\": true },\n                                function (event) {\n                                    if (window.ue) {\n                                        ue.count(\"acrLinkClickCount\", (ue.count(\"acrLinkClickCount\") || 0) + 1);\n                                    }\n                                }\n                            );\n                        }\n                    });\n                </script>\n                 <script type=\"text/javascript\">\n            P.when('A', 'cf').execute(function(A) {\n                A.declarative('acrStarsLink-click-metrics', 'click', { \"allowLinkDefault\" : true },  function(event){\n                    if(window.ue) {\n                        ue.count(\"acrStarsLinkWithPopoverClickCount\", (ue.count(\"acrStarsLinkWithPopoverClickCount\") || 0) + 1);\n                    }\n                });\n            });\n        </script>\n\n           </div>\n      <br> 4.3 out of 5 stars"date_first_available: "7 Dec. 2023"delivery_information: "We cannot deliver certain products outside mainland UK ( <a href=\"/gp/help/customer/display.html?nodeId=201337930\">Details</a>). We will only be able to confirm if this product can be delivered to your chosen address when you enter your delivery address at checkout."[[Prototype]]: Objecttable_3: {}[[Prototype]]: Objecttable_4: {}[[Prototype]]: Object
// VM5050:84 Using prodDetails structure: true