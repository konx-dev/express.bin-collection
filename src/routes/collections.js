// src/routes/collections.js
const express = require('express');
const moment = require('moment-timezone');

function createCollectionsRouter(db, TIMEZONE) {
    const router = express.Router();

    /**
     * API Endpoint: /next
     * Finds the next scheduled collection starting from current day.
     */
    router.get('/next', (req, res) => {
        try {
            const today = moment().tz(TIMEZONE).format('YYYY-MM-DD');

            const stmt = db.prepare(`
                SELECT date, collection 
                FROM collections 
                WHERE date >= ? 
                  AND collection IS NOT '' 
                ORDER BY date ASC 
                LIMIT 1
            `);

            const nextCollection = stmt.get(today);

            if (nextCollection) {
                return res.json({
                    status: 'success',
                    message: 'Next scheduled collection found.',
                    collection: nextCollection
                });
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: `No future collections found starting from ${today}.`
                });
            }
        } catch (error) {
            console.error('Error fetching next collection:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error while querying database.' });
        }
    });

    return router;
}

module.exports = createCollectionsRouter;
