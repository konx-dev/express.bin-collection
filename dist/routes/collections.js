"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cache_1 = __importDefault(require("../middleware/cache"));
const collectionService_1 = __importDefault(require("../services/collectionService"));
// --- ROUTER FUNCTION ---
function createCollectionsRouter(db, TIMEZONE) {
    const router = express_1.default.Router();
    const collectionService = (0, collectionService_1.default)(db, TIMEZONE);
    router.use(cache_1.default);
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
            }
            else {
                return res.status(404).json({
                    status: 'error',
                    message: 'No future collections found.'
                });
            }
        }
        catch (error) {
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
            }
            else {
                return res.json({
                    status: 'error',
                    message: 'No collections scheduled for tomorrow.'
                });
            }
        }
        catch (error) {
            console.error('Error fetching tomorrow\'s collection:', error);
            return res.status(500).json({ status: 'error', message: 'Internal server error.' });
        }
    });
    return router;
}
exports.default = createCollectionsRouter;
//# sourceMappingURL=collections.js.map