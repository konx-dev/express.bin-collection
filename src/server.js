// -------------------------------------------------------------------------
// Bin Calendar API Server: src/server.js
// This Express application serves the bin collection schedule from an SQLite DB.
// -------------------------------------------------------------------------

require('dotenv').config();
const express = require('express');
const sqlite = require('better-sqlite3');
const path = require('path');
const createCollectionsRouter = require('./routes/collections');
const indexRouter = require('./routes/index');
const rateLimit = require('express-rate-limit');

// --- Configuration ---
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, '..', process.env.DB_NAME || 'collections.db');
const TIMEZONE = process.env.TIMEZONE || 'Europe/London';

// --- Initialize Database Connection ---
let db;
try {
    db = new sqlite(DB_PATH);
    console.log(`Database connected successfully at ${DB_PATH}.`);
} catch (error) {
    console.error(`\n!!! ERROR: Failed to connect to database at ${DB_PATH} !!!`);
    console.error('Please ensure the database has been created by running: "npm run setup" (or check Docker logs).');
    // Exit if the database connection fails
    process.exit(1);
}

const app = express();

// --- Rate Limiting ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // set limit window
    max: 50, // request limit
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
app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'Not Found' });
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
