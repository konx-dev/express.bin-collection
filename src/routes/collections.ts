import express, { Router, Request, Response } from 'express';
import { Database } from 'better-sqlite3';
import cacheMiddleware from '../middleware/cache';
import createCollectionService from '../services/collectionService';

// --- INTERFACES ---
export interface Collection {
    type: string;
    date: string;
    description?: string;
}

interface CollectionService {
    getNextCollection: () => Collection | null;
    getTomorrowCollection: () => Collection | null;
}

// --- ROUTER FUNCTION ---
function createCollectionsRouter(db: Database, TIMEZONE: string): Router {
    const router: Router = express.Router();
    
    const collectionService: CollectionService = createCollectionService(db, TIMEZONE);

    router.use(cacheMiddleware);

    /**
     * API Endpoint: /next
     * Finds the next scheduled collection.
     */
    router.get('/next', (req: Request, res: Response): Response => {
        try {
            const nextCollection: Collection | null = collectionService.getNextCollection();

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
    router.get('/tomorrow', (req: Request, res: Response): Response => {
        try {
            const tomorrowCollection: Collection | null = collectionService.getTomorrowCollection();

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

export default createCollectionsRouter;