import bcrypt from 'bcryptjs';
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

    public static async signIn(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            let user = await prisma.user.findFirst({
                where: {
                    email,
                },
            });
            if (!user) {
                throw Error('User not found.');
            }

            const isUserAuthenticated = bcrypt.compareSync(
                password,
                user.password
            );
            if (!isUserAuthenticated) {
                throw Error('Please enter the correct password.');
            }

            // @ts-ignore
            delete user.password;

            return ResponseHandler(req, res, {
                user,
                message: 'User created successfully.',
            });
        } catch (error) {
            return ResponseHandler(req, res, null, error);
        }
    }
}
