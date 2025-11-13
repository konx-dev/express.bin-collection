import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

/**
 * API Endpoint: /
 * Displays a welcome message.
 */
router.get('/', (req: Request, res: Response) => {
    return res.json({
        message: 'Welcome to the Bin Collection API. Please see the wiki for available API endpoints.',
        documentation_url: 'https://github.com/konx-dev/express.bin-collection/wiki'
    });
});

export default router;