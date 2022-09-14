import { Request, Response, Router } from 'express';
import { logger } from '../../providers/logger';
import { verifyJWT } from '../middleware/Auth';
import { AuthRouter } from './auth.api';
import { LeaveRouter } from './leave.api';
import { UserRouter } from './user.api';

export const router = Router();

// Import routes
router.use('/auth', AuthRouter);
router.use('/user', verifyJWT, UserRouter);
router.use('/leave', verifyJWT, LeaveRouter);

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
