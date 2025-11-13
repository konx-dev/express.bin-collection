"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/**
 * API Endpoint: /
 * Displays a welcome message.
 */
router.get('/', (req, res) => {
    return res.json({
        message: 'Welcome to the Bin Collection API. Please see the wiki for available API endpoints.',
        documentation_url: 'https://github.com/konx-dev/express.bin-collection/wiki'
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map