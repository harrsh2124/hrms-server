import { NextFunction, Request, Response } from 'express';
import { AnyObjectSchema } from 'yup';
import { ResponseHandler } from './ResponseHandler';

/**
 * Validate that a resource being POSTed or PUT
 * has a valid shape, else return 400 Bad Request
 * @param {*} resourceSchema is a yup schema
 */
export const RequestValidator =
    (resourceSchema: AnyObjectSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const value = await resourceSchema.validateSync(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });
            req.body.validatedData = value;
            next();
        } catch (error: any) {
            error.message = error.errors[0];
            return ResponseHandler(req, res, null, error);
        }
    };
