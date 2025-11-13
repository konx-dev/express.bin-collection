"use strict";
// src/services/collectionService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports for external libraries
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// --- SERVICE CREATOR FUNCTION ---
// Type the parameters and the return value
function createCollectionService(db, TIMEZONE) {
    // --- Utility Functions (Internal to the service) ---
    // Function to convert the database row object into the standardized Collection interface
    // Note: The database query result is typed as DbCollectionRow | undefined
    const mapDbRowToCollection = (row) => {
        if (!row) {
            return null;
        }
        return {
            date: row.date,
            type: row.collection // map 'collection' from DB to 'type' for the API response
        };
    };
    // --- Public Service Methods ---
    const getNextCollection = () => {
        // Explicitly typing the variables
        const today = (0, moment_timezone_1.default)().tz(TIMEZONE).format('YYYY-MM-DD');
        // Statements should be typed as Statement
        const query = db.prepare(`
            SELECT date, collection 
            FROM collections 
            WHERE date >= ? 
              AND collection IS NOT '' 
            ORDER BY date ASC 
            LIMIT 1
        `);
        // .get<T> allows us to cast the result to the expected type
        const result = query.get(today);
        return mapDbRowToCollection(result);
    };
    const getTomorrowCollection = () => {
        const tomorrow = (0, moment_timezone_1.default)().tz(TIMEZONE).add(1, 'days').format('YYYY-MM-DD');
        const query = db.prepare(`
            SELECT date, collection 
            FROM collections 
            WHERE date = ?
              AND collection IS NOT ''
        `);
        const result = query.get(tomorrow);
        return mapDbRowToCollection(result);
    };
    // Return the service object, typed as CollectionService
    return {
        getNextCollection,
        getTomorrowCollection,
    };
}
// Use ES Module export
exports.default = createCollectionService;
//# sourceMappingURL=collectionService.js.map