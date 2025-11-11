// src/routes/collections.js
const express = require('express');
const moment = require('moment-timezone');
const NodeCache = require('node-cache');

// Create a new cache instance with a 24-hour TTL
const cache = new NodeCache({ stdTTL: 86400 });

function createCollectionsRouter(db, TIMEZONE) {
    const router = express.Router();

    /**
     * API Endpoint: /next
     * Finds the next scheduled collection starting from current day.
     */
    router.get('/next', (req, res) => {
        const cacheKey = 'next-collection';

        // Bust cache if refresh is requested
        if (req.query.refresh === 'true') {
            cache.del(cacheKey);
        }

        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            // Add a header to indicate the response is from cache
            res.set('X-Cache', 'HIT');
            return res.json(cachedData);
        }

        try {
            const today = moment().tz(TIMEZONE).format('YYYY-MM-DD');

            const query = db.prepare(`
                SELECT date, collection 
                FROM collections 
                WHERE date >= ? 
                  AND collection IS NOT '' 
                ORDER BY date ASC 
                LIMIT 1
            `);

            const nextCollection = query.get(today);

            if (nextCollection) {
                const response = {
                    status: 'success',
                    message: 'Next scheduled collection found.',
                    collection: nextCollection
                };
                cache.set(cacheKey, response);
                // Add a header to indicate the response is from the database
                res.set('X-Cache', 'MISS');
                return res.json(response);
            } else {
                const response = {
                    status: 'error',
                    message: `No future collections found starting from ${today}.`
                };
                // Cache the "not found" response as well to avoid repeated DB queries
                cache.set(cacheKey, response);
                res.set('X-Cache', 'MISS');
                return res.status(404).json(response);
            }
        } catch (error) {
            console.error('Error fetching next collection:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error while querying database.' });
        }
    });

    /**
     * API Endpoint: /tomorrow
     * Checks for a scheduled collection for the next day.
     */
    router.get('/tomorrow', (req, res) => {
        const cacheKey = 'tomorrow-collection';

        // Bust cache if refresh is requested
        if (req.query.refresh === 'true') {
            cache.del(cacheKey);
        }
        
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            res.set('X-Cache', 'HIT');
            return res.json(cachedData);
        }

        try {
            const tomorrow = moment().tz(TIMEZONE).add(1, 'days').format('YYYY-MM-DD');

            const query = db.prepare(`
                SELECT date, collection 
                FROM collections 
                WHERE date = ?
                  AND collection IS NOT ''
            `);

            const tomorrowCollection = query.get(tomorrow);

            if (tomorrowCollection) {
                const response = {
                    status: 'success',
                    message: 'Collection scheduled for tomorrow.',
                    collection: tomorrowCollection
                };
                cache.set(cacheKey, response);
                res.set('X-Cache', 'MISS');
                return res.json(response);
            } else {
                const response = {
                    status: 'error',
                    message: `No collections found for ${tomorrow}.`
                };
                cache.set(cacheKey, response);
                res.set('X-Cache', 'MISS');
                return res.json(response);
            }
        } catch (error) {
            console.error('Error fetching tomorrow\'s collection:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error while querying database.' });
        }
    });

    return router;
}

module.exports = createCollectionsRouter;
