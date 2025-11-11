// src/middleware/cache.js
const NodeCache = require('node-cache');

// stdTTL is the default time-to-live for each cache entry in seconds
const TTL = 86400; // 24 hours
const cache = new NodeCache({ stdTTL: TTL });

/**
 * Express middleware for caching responses.
 *
 * This middleware checks for a cached response using the request's original URL as a key.
 * If a cached version is found, it's served immediately with an 'X-Cache: HIT' header.
 *
 * A cache bust can be forced by adding `?refresh=true` to the request URL.
 *
 * If no cached version is available, it proceeds to the route handler.
 * It then intercepts the JSON response, caches it, and sends it with an 'X-Cache: MISS' header.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 */
const cacheMiddleware = (req, res, next) => {
    const cacheKey = req.originalUrl;

    // Allow cache busting via query parameter
    if (req.query.refresh === 'true') {
        cache.del(cacheKey);
    }

    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
        res.set('X-Cache', 'HIT');
        return res.status(cachedResponse.statusCode || 200).json(cachedResponse.body);
    }

    // If not in cache, override res.json to cache the response before sending
    const originalJson = res.json;
    res.json = (body) => {
        const responseToCache = {
            statusCode: res.statusCode,
            body: body,
        };
        // Only cache successful responses
        if (res.statusCode === 200) {
            cache.set(cacheKey, responseToCache);
        }
        res.set('X-Cache', 'MISS');
        originalJson.call(res, body);
    };

    next();
};

module.exports = cacheMiddleware;