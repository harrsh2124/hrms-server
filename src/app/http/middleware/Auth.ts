import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../env';
import { prisma } from '../../providers/db';
import { ResponseHandler } from './ResponseHandler';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1].trim();

        if (token === null || token === undefined) {
            throw new Error('Unauthorized request');
        } else {
            const requestUser = jwt.verify(token, env.app.auth.secret);

            const user = prisma.user.findFirst({
                where: {
                    // @ts-ignore
                    email: requestUser.email,

                    // @ts-ignore
                    id: requestUser.id,
                },
            });
            if (!user) {
                throw new Error('User not found.');
            }

            req.body = {
                requestUser,
            };
            next();
        }
    } catch (error) {
        return ResponseHandler(req, res, null, error);
    }
};
