import * as dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response, NextFunction } from 'express';
import sqlite, { Database } from 'better-sqlite3';
import path from 'path';
import rateLimit from 'express-rate-limit';

import createCollectionsRouter from './routes/collections';
import indexRouter from './routes/index';

// --- Configuration Variables ---
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const DB_NAME: string = process.env.DB_NAME || 'collections.db';
const DB_PATH: string = path.join(__dirname, '..', DB_NAME);
const TIMEZONE: string = process.env.TIMEZONE || 'Europe/London';

// --- Initialize Database Connection ---
let db: Database;

try {
    db = new sqlite(DB_PATH);
    db.pragma('journal_mode = WAL'); 
    console.log(`Database connected successfully at ${DB_PATH}.`);
} catch (error) {
    console.error(`\n!!! ERROR: Failed to connect to database at ${DB_PATH} !!!`);
    console.error('Please ensure the database has been created by running: "npm run setup" (or check Docker logs).');
    process.exit(1);
}

const app: Application = express();

// --- Rate Limiting ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());

// --- Routes ---
const collectionsRouter = createCollectionsRouter(db, TIMEZONE); 

app.use('/', indexRouter);
app.use('/api', collectionsRouter);

// --- 404 Handler ---
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ status: 'error', message: 'Not Found' });
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});