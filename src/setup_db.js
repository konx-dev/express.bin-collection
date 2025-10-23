// -------------------------------------------------------------------------
// Bin Collection DB Setup - src/setup_db.js
// Reads the JSON file from the data folder and populates the SQLite DB.
// -------------------------------------------------------------------------

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sqlite = require('better-sqlite3');

const DB_NAME = process.env.DB_NAME || 'collections.db';
const JSON_FILE = process.env.CALENDAR_JSON || 'example_calendar.json'; 

const DB_PATH = path.join(__dirname, '..', DB_NAME); 
const JSON_PATH = path.join(__dirname, '..', 'data', JSON_FILE);


function initializeDatabase() {
    console.log(`Starting database initialization from: ${JSON_FILE}`);
    
    if (!fs.existsSync(JSON_PATH)) {
        console.error(`\n--- ERROR ---\nJSON file '${JSON_FILE}' not found at ${JSON_PATH}.\nPlease ensure the file is in the 'data/' folder.`);
        return;
    }

    let db;
    try {
        const rawData = fs.readFileSync(JSON_PATH, 'utf8');
        const dataToInsert = JSON.parse(rawData);
        
        if (!Array.isArray(dataToInsert) || dataToInsert.length === 0) {
            console.error(`\n--- ERROR ---\nThe JSON file is empty or not formatted as an array of objects.`);
            return;
        }
        
        db = new sqlite(DB_PATH);
        
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

        // 2. Insert data
        insertMany(dataToInsert);
        console.log(`\nSuccessfully loaded ${dataToInsert.length} records into ${DB_NAME}.`);

    } catch (error) {
        console.error("An error occurred during database setup:", error.message);
    } finally {
        if (db) {
            db.close();
            console.log("Database connection closed.");
        }
    }
}

if (require.main === module) {
    initializeDatabase();
}
