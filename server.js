const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.post('/save-reviews', async (req, res) => {
    const { asin, allReviews, criticalReviews } = req.body; // Expecting allReviews and criticalReviews

    if (!asin || !allReviews || !criticalReviews || !Array.isArray(allReviews) || !Array.isArray(criticalReviews)) {
        console.error("[SERVER DEBUG] Invalid request body received:", req.body); // Server-side error log for invalid body
        return res.status(400).json({ error: 'Invalid request body. Expecting ASIN, allReviews, and criticalReviews arrays.' });
    }

    try {
        const timestamp = new Date().toISOString().replace(/[:T\-Z\.]/g, '_');
        const filename = `reviews_${asin}_all_critical_${timestamp}.json`; // Updated filename
        const filePath = `./review_data/${filename}`;

        if (!fs.existsSync('./review_data')) {
            fs.mkdirSync('./review_data');
        }

        console.log(`[SERVER DEBUG] Saving reviews for ASIN ${asin} to ${filePath}. All Reviews Count: ${allReviews.length}, Critical Reviews Count: ${criticalReviews.length}`); // Server-side log before saving

        fs.writeFileSync(filePath, JSON.stringify({
            asin: asin,
            allReviews: allReviews,
            criticalReviews: criticalReviews
        }, null, 2));
        console.log(`[SERVER DEBUG] Successfully saved reviews for ASIN ${asin} to ${filePath}`); // Server-side log after saving

        res.json({ message: `Reviews for ASIN ${asin} (all and critical) saved successfully to ${filename}`, filename: filename });

    } catch (error) {
        console.error("[SERVER DEBUG] Error saving reviews to file:", error); // Verbose server-side error log
        res.status(500).json({ error: 'Error saving reviews to file.' });
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});