import { Request, Response, Router } from 'express';
import { logger } from '../../providers/logger';
import { AuthRouter } from './auth.api';
import { UserRouter } from './user.api';

export const router = Router();

// Import routes
router.use('/auth', AuthRouter);
router.use('/user', UserRouter);

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
