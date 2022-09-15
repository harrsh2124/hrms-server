import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../env';
import { prisma } from '../../providers/db';
import { sanitizeDate } from '../../utils/dateUtil';
import { ResponseHandler } from '../middleware/ResponseHandler';

export class AuthController {
    public static async signUp(req: Request, res: Response) {
        try {
            let {
                email,
                password,
                contactNumber,
                firstName,
                lastName,
                joiningDate,
            } = req.body;

            joiningDate = sanitizeDate(joiningDate);

            if (!joiningDate) {
                throw new Error('Please enter a valid joining date.');
            }

            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                },
            });
            if (existingUser) {
                throw new Error('User already exists.');
            }

            const encryptedPassword = bcrypt.hashSync(password);

            const user = await prisma.user.create({
                data: {
                    email,
                    password: encryptedPassword,
                    contactNumber,
                    firstName,
                    lastName,
                    confirmationToken: crypto.randomBytes(20).toString('hex'),
                    joiningDate,
                },
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
                    userEmail: user.email,
                    userID: user.id,
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
