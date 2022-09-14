import { Request, Response } from 'express';
import { prisma } from '../../providers/db';
import { ResponseHandler } from '../middleware/ResponseHandler';

export class UserController {
    public static async profile(req: Request, res: Response) {
        try {
            let id;
            id = req.params.id;

            if (!id) {
                id = req.body.requestUser.userID;
            }

            const user = await prisma.user.findFirst({
                where: {
                    id: +id,
                    isActive: true,
                    isConfirmed: true,
                },
            });

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
