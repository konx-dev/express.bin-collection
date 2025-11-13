"use strict";
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
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cache_1 = __importDefault(require("node-cache"));
const TTL = 86400; // 24 hours
const cache = new node_cache_1.default({ stdTTL: TTL });
const cacheMiddleware = (req, res, next) => {
    const cacheKey = req.originalUrl;
    const isRefresh = req.query.refresh === 'true';
    // Allow cache busting via query parameter
    if (isRefresh) {
        cache.del(cacheKey);
    }
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
        res.set('X-Cache', 'HIT');
        return res.status(cachedResponse.statusCode || 200).json(cachedResponse.body);
    }
    const originalJson = res.json.bind(res);
    // Override res.json to cache the response before sending
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
        return originalJson(body);
    };
    next();
};
exports.default = cacheMiddleware;
//# sourceMappingURL=cache.js.map