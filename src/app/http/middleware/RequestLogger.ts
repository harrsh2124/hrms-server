import { NextFunction, Request, Response } from 'express';
import { logger } from '../../providers/logger';

export const RequestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`Route: ${req.method} ${req.originalUrl}`);

    next();
};
