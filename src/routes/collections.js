// src/routes/collections.js
const express = require('express');
const cacheMiddleware = require('../middleware/cache');
const createCollectionService = require('../services/collectionService');

function createCollectionsRouter(db, TIMEZONE) {
    const router = express.Router();
    const collectionService = createCollectionService(db, TIMEZONE);

    // Apply the cache middleware to all GET requests in this router
    router.use(cacheMiddleware);

    /**
     * API Endpoint: /next
     * Finds the next scheduled collection.
     */
    router.get('/next', (req, res) => {
        try {
            const nextCollection = collectionService.getNextCollection();

            if (nextCollection) {
                return res.json({
                    status: 'success',
                    message: 'Next scheduled collection found.',
                    collection: nextCollection
                });
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: 'No future collections found.'
                });
            }
        } catch (error) {
            console.error('Error fetching next collection:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error.' });
        }
    });

    /**
     * API Endpoint: /tomorrow
     * Checks for a scheduled collection for the next day.
     */
    router.get('/tomorrow', (req, res) => {
        try {
            const tomorrowCollection = collectionService.getTomorrowCollection();

            if (tomorrowCollection) {
                return res.json({
                    status: 'success',
                    message: 'Collection scheduled for tomorrow.',
                    collection: tomorrowCollection
                });
            } else {
                return res.json({
                    status: 'error',
                    message: 'No collections scheduled for tomorrow.'
                });
            }
        } catch (error) {
            console.error('Error fetching tomorrow\'s collection:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error.' });
        }
    });

    return router;
}

module.exports = createCollectionsRouter;
