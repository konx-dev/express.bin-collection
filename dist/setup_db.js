"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
// --- Configuration Variables ---
const DB_NAME = process.env.DB_NAME || 'collections.db';
const JSON_FILE = process.env.CALENDAR_JSON || 'example_calendar.json';
const DB_PATH = path_1.default.join(__dirname, '..', DB_NAME);
const JSON_PATH = path_1.default.join(__dirname, '..', 'data', JSON_FILE);
// --- Main Function ---
function initializeDatabase() {
    console.log(`Starting database initialization from: ${JSON_FILE}`);
    // Check for JSON file existence
    if (!fs_1.default.existsSync(JSON_PATH)) {
        console.error(`\n--- ERROR ---\nJSON file '${JSON_FILE}' not found at ${JSON_PATH}.\nPlease ensure the file is in the 'data/' folder.`);
        return;
    }
    let db;
    try {
        const rawData = fs_1.default.readFileSync(JSON_PATH, 'utf8');
        const dataToInsert = JSON.parse(rawData);
        if (!Array.isArray(dataToInsert) || dataToInsert.length === 0) {
            console.error(`\n--- ERROR ---\nThe JSON file is empty or not formatted as an array of objects.`);
            return;
        }
        // Initialize DB connection
        db = new better_sqlite3_1.default(DB_PATH);
        // Create Table
        db.exec(`
            CREATE TABLE IF NOT EXISTS collections (
                date TEXT PRIMARY KEY,
                collection TEXT
            )
        `);
        console.log("Table 'collections' ensured.");
        const insertStmt = db.prepare(`
            INSERT OR REPLACE INTO collections (date, collection) VALUES (?, ?)
        `);
        const insertMany = db.transaction((data) => {
            for (const row of data) {
                const dateVal = (row.date || '').trim();
                const collectionVal = (row.collection || '').trim();
                if (dateVal) {
                    insertStmt.run(dateVal, collectionVal);
                }
            }
        });
        insertMany(dataToInsert);
        console.log(`\nSuccessfully loaded ${dataToInsert.length} records into ${DB_NAME}.`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred during database setup:", error.message);
        }
        else {
            console.error("An unknown error occurred during database setup.");
        }
    }
    finally {
        // Close connection if it was successfully opened
        if (db) {
            db.close();
            console.log("Database connection closed.");
        }
    }
}
initializeDatabase();
//# sourceMappingURL=setup_db.js.map