import { Request, Response } from 'express';
import { prisma } from '../../providers/db';
import { ResponseHandler } from '../middleware/ResponseHandler';

export class UserController {
    public static async profile(req: Request, res: Response) {
        try {
            const { email } = req.body.requestUser;
            const { id } = req.params;

            let user;
            if (id) {
                user = await prisma.user.findFirst({
                    where: {
                        id: +id,
                        isActive: true,
                        isConfirmed: true,
                    },
                });
            } else {
                user = await prisma.user.findFirst({
                    where: {
                        email,
                        isActive: true,
                        isConfirmed: true,
                    },
                });
            }
            if (!user) {
                throw new Error('User not found.');
            }

            // @ts-ignore
            delete user.password;

            return ResponseHandler(req, res, {
                user,
                message: 'User details fetched successfully',
            });
        } catch (error) {
            return ResponseHandler(req, res, null, error);
        }
    }
}
