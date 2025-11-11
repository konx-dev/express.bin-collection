// src/routes/index.js
const express = require('express');
const router = express.Router();

/**
 * API Endpoint: /
 * Displays a welcome message.
 */
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Bin Collection API. Please see the wiki for available API endpoints.',
        documentation_url: 'https://github.com/konx-dev/express.bin-collection/wiki'
    });
});

module.exports = router;
