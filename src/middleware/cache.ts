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

import NodeCache from 'node-cache';
import { Request, Response, NextFunction } from 'express';

interface CachedResponse {
    statusCode: number;
    body: any;
}

const TTL: number = 86400; // 24 hours

const cache = new NodeCache({ stdTTL: TTL });

const cacheMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): Response<any, Record<string, any>> | void => {
    
    const cacheKey: string = req.originalUrl;

    const isRefresh: boolean = req.query.refresh === 'true';

    // Allow cache busting via query parameter
    if (isRefresh) {
        cache.del(cacheKey);
    }

    const cachedResponse: CachedResponse | undefined = cache.get<CachedResponse>(cacheKey);

    if (cachedResponse) {
        res.set('X-Cache', 'HIT');
        return res.status(cachedResponse.statusCode || 200).json(cachedResponse.body);
    }

    const originalJson = res.json.bind(res);

    // Override res.json to cache the response before sending
    res.json = (body: any): Response<any, Record<string, any>> => {
        const responseToCache: CachedResponse = {
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

export default cacheMiddleware;