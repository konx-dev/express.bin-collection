import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import sqlite, { Database, Statement } from 'better-sqlite3';

// --- INTERFACES ---
interface CalendarRow {
    date: string;
    collection: string;
}

// --- Configuration Variables ---
const DB_NAME: string = process.env.DB_NAME || 'collections.db';
const JSON_FILE: string = process.env.CALENDAR_JSON || 'example_calendar.json'; 

const DB_PATH: string = path.join(__dirname, '..', DB_NAME); 
const JSON_PATH: string = path.join(__dirname, '..', 'data', JSON_FILE);

// --- Main Function ---
function initializeDatabase(): void {
    console.log(`Starting database initialization from: ${JSON_FILE}`);
    
    // Check for JSON file existence
    if (!fs.existsSync(JSON_PATH)) {
        console.error(`\n--- ERROR ---\nJSON file '${JSON_FILE}' not found at ${JSON_PATH}.\nPlease ensure the file is in the 'data/' folder.`);
        return;
    }

    let db: Database | undefined;
    try {
        const rawData: string = fs.readFileSync(JSON_PATH, 'utf8');
    
        const dataToInsert: CalendarRow[] = JSON.parse(rawData) as CalendarRow[];
        
        if (!Array.isArray(dataToInsert) || dataToInsert.length === 0) {
            console.error(`\n--- ERROR ---\nThe JSON file is empty or not formatted as an array of objects.`);
            return;
        }
        
        // Initialize DB connection
        db = new sqlite(DB_PATH);
        
        // Create Table
        db.exec(`
            CREATE TABLE IF NOT EXISTS collections (
                date TEXT PRIMARY KEY,
                collection TEXT
            )
        `);
        console.log("Table 'collections' ensured.");

        const insertStmt: Statement = db.prepare(`
            INSERT OR REPLACE INTO collections (date, collection) VALUES (?, ?)
        `);
        
        const insertMany = db.transaction((data: CalendarRow[]) => {
            for (const row of data) {
                const dateVal: string = (row.date || '').trim();
                const collectionVal: string = (row.collection || '').trim(); 
                
                if (dateVal) {
                    insertStmt.run(dateVal, collectionVal);
                }
            }
        });

        insertMany(dataToInsert);
        console.log(`\nSuccessfully loaded ${dataToInsert.length} records into ${DB_NAME}.`);

    } catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred during database setup:", error.message);
        } else {
             console.error("An unknown error occurred during database setup.");
        }
    } finally {
        // Close connection if it was successfully opened
        if (db) {
            db.close();
            console.log("Database connection closed.");
        }
    }
}

initializeDatabase();