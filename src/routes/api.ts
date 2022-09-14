import { Request, Response, Router } from 'express';
import { logger } from '../app/providers/logger';

export const router = Router();

// Import routes

// Add other routes

/**
 * 404 api redirects
 */
router.use(function (req: Request, res: Response) {
    logger.info(`Error 404: ${req.method} ${req.originalUrl} - Not Found`);

    res.status(404).send({
        status: false,
        message: 'Not found',
    });
});
