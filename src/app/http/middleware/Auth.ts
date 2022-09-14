import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../env';
import { ResponseHandler } from './ResponseHandler';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1].trim();

        if (token === null || token === undefined) {
            throw new Error('Unauthorized request');
        } else {
            const user = jwt.verify(token, env.app.auth.secret);
            req.body = {
                requestUser: user,
            };
            next();
        }
    } catch (error) {
        return ResponseHandler(req, res, null, error);
    }
};