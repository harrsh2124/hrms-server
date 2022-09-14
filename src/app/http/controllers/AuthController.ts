import { Request, Response } from 'express';
import { prisma } from '../../providers/db';
import { ResponseHandler } from '../middleware/ResponseHandler';
import { UserSignUp } from '../services/auth/UserSignUp';

export class AuthController {
    public static async signUp(req: Request, res: Response) {
        try {
            const { email, password, contactNumber, firstName, lastName } =
                req.body;

            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                },
            });
            if (existingUser) {
                throw Error('User already exists.');
            }

            const user = await UserSignUp({
                email,
                password,
                contactNumber,
                firstName,
                lastName,
            });

            return ResponseHandler(req, res, {
                user,
                message: 'User created successfully.',
            });
        } catch (error) {
            return ResponseHandler(req, res, null, error);
        }
    }
}
