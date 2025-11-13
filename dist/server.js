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
const express_1 = __importDefault(require("express"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const collections_1 = __importDefault(require("./routes/collections"));
const index_1 = __importDefault(require("./routes/index"));
// --- Configuration Variables ---
const PORT = parseInt(process.env.PORT || '3000', 10);
const DB_NAME = process.env.DB_NAME || 'collections.db';
const DB_PATH = path_1.default.join(__dirname, '..', DB_NAME);
const TIMEZONE = process.env.TIMEZONE || 'Europe/London';
// --- Initialize Database Connection ---
let db;
try {
    db = new better_sqlite3_1.default(DB_PATH);
    db.pragma('journal_mode = WAL');
    console.log(`Database connected successfully at ${DB_PATH}.`);
}
catch (error) {
    console.error(`\n!!! ERROR: Failed to connect to database at ${DB_PATH} !!!`);
    console.error('Please ensure the database has been created by running: "npm run setup" (or check Docker logs).');
    process.exit(1);
}
const app = (0, express_1.default)();
// --- Rate Limiting ---
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use(express_1.default.json());
// --- Routes ---
const collectionsRouter = (0, collections_1.default)(db, TIMEZONE);
app.use('/', index_1.default);
app.use('/api', collectionsRouter);
// --- 404 Handler ---
app.use((req, res, next) => {
    res.status(404).json({ status: 'error', message: 'Not Found' });
});
// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map