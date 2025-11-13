// src/services/collectionService.ts

// Imports for external libraries
import moment from 'moment-timezone';
import { Database, Statement } from 'better-sqlite3';

// --- INTERFACES ---

// The structure of the object returned by the database query
interface DbCollectionRow {
    date: string;       // Date in 'YYYY-MM-DD' format
    collection: string; // The type of collection (e.g., "General Waste", "Recycling")
}

// The structure of the data that the service returns to the route handler
// We will use the same interface name used in src/routes/collections.ts
// This helps ensure consistency across your application.
export interface Collection {
    date: string;
    type: string; 
    description?: string; // If you later add a description column/field
}

// The expected structure of the service object itself
export interface CollectionService {
    getNextCollection: () => Collection | null;
    getTomorrowCollection: () => Collection | null;
}

// --- SERVICE CREATOR FUNCTION ---

// Type the parameters and the return value
function createCollectionService(db: Database, TIMEZONE: string): CollectionService {
    
    // --- Utility Functions (Internal to the service) ---

    // Function to convert the database row object into the standardized Collection interface
    // Note: The database query result is typed as DbCollectionRow | undefined
    const mapDbRowToCollection = (row: DbCollectionRow | undefined): Collection | null => {
        if (!row) {
            return null;
        }
        return {
            date: row.date,
            type: row.collection // map 'collection' from DB to 'type' for the API response
        };
    };

    // --- Public Service Methods ---

    const getNextCollection = (): Collection | null => {
        // Explicitly typing the variables
        const today: string = moment().tz(TIMEZONE).format('YYYY-MM-DD');
        
        // Statements should be typed as Statement
        const query: Statement = db.prepare(`
            SELECT date, collection 
            FROM collections 
            WHERE date >= ? 
              AND collection IS NOT '' 
            ORDER BY date ASC 
            LIMIT 1
        `);
        
        // .get<T> allows us to cast the result to the expected type
        const result = query.get(today) as DbCollectionRow | undefined;
        
        return mapDbRowToCollection(result);
    };

    const getTomorrowCollection = (): Collection | null => {
        const tomorrow: string = moment().tz(TIMEZONE).add(1, 'days').format('YYYY-MM-DD');
        
        const query: Statement = db.prepare(`
            SELECT date, collection 
            FROM collections 
            WHERE date = ?
              AND collection IS NOT ''
        `);
        
        const result = query.get(tomorrow) as DbCollectionRow | undefined;
        
        return mapDbRowToCollection(result);
    };

    // Return the service object, typed as CollectionService
    return {
        getNextCollection,
        getTomorrowCollection,
    };
}

// Use ES Module export
export default createCollectionService;