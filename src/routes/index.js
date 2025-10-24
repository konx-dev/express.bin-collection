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


/**
 * DANGEROUS TEST ROUTE - DO NOT USE IN PRODUCTION
 * This route contains a vulnerable regular expression for testing CodeQL.
 */
router.get('/test-redos/:input', (req, res) => {
    const { input } = req.params;
    const vulnerableRegex = /^(a+)+$/;

    // This line will cause the server to hang with a malicious input
    if (vulnerableRegex.test(input)) {
        res.send('Input matched (vulnerable).');
    } else {
        res.send('Input did not match.');
    }
});

module.exports = router;
