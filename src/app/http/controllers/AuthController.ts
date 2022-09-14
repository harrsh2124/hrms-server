import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../env';
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
                throw new Error('User already exists.');
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

            const user = await prisma.user.findFirst({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new Error('User not found.');
            }

            const isUserAuthenticated = bcrypt.compareSync(
                password,
                user.password
            );
            if (!isUserAuthenticated) {
                throw new Error('Please enter the correct password.');
            }

            if (!user.isActive || !user.isConfirmed) {
                throw new Error('User is not activated.');
            }

            // @ts-ignore
            delete user.password;

            const token = jwt.sign(
                {
                    email: user.email,
                },
                env.app.auth.secret
            );

            return ResponseHandler(req, res, {
                user,
                token,
                message: 'User signed in successfully.',
            });
        } catch (error) {
            return ResponseHandler(req, res, null, error);
        }
    }

    public static async verifyUser(req: Request, res: Response) {
        try {
            const { token, id } = req.params;

            const user = await prisma.user.findFirst({
                where: {
                    id: +id,
                    isConfirmed: false,
                    isActive: true,
                    confirmationToken: token,
                },
            });
            if (!user) {
                throw new Error('User not found.');
            }

            await prisma.user.update({
                where: {
                    id: +id,
                },
                data: {
                    confirmationToken: null,
                    isConfirmed: true,
                },
            });

            return ResponseHandler(req, res, {
                message: 'User verified successfully.',
            });
        } catch (error) {
            return ResponseHandler(req, res, null, error);
        }
    }
}
