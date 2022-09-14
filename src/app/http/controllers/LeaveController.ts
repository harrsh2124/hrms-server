import { Request, Response } from 'express';
import { prisma } from '../../providers/db';
import { validateDate } from '../../utils';
import { ResponseHandler } from '../middleware/ResponseHandler';

export class LeaveController {
    public static async addLeave(req: Request, res: Response) {
        try {
            const { userID } = req.body.requestUser;
            const { startDate, endDate, reason } = req.body;

            if (!validateDate(startDate) || !validateDate(endDate)) {
                throw new Error('Please enter a valid date.');
            }

            const startDateObject = new Date(startDate);
            const endDateObject = new Date(endDate);
            const today = new Date();

            if (today.getDate() > startDateObject.getDate()) {
                throw new Error(
                    'Start date must be not be lesser than present date.'
                );
            }

            if (startDateObject.getDate() > endDateObject.getDate()) {
                throw new Error(
                    'End date must be not be lesser than start date.'
                );
            }

            const newLeave = await prisma.leave.create({
                data: {
                    startDate,
                    endDate,
                    reason,
                    userId: +userID,
                },
            });

            return ResponseHandler(req, res, {
                leave: newLeave,
                message: 'New leave added successfully.',
            });
        } catch (error) {
            return ResponseHandler(req, res, null, error);
        }
    }
}
