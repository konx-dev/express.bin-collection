// src/routes/index.js
const express = require('express');
const router = express.Router();

/**
 * API Endpoint: /
 * Displays a welcome message.
 */
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Bin Collection API. Please see /api/next for the next collection.'
    });
});

module.exports = router;
