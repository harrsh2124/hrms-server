import { Request, Response } from 'express';
import { prisma } from '../../providers/db';
import { isBefore, sanitizeDate } from '../../utils/dateUtil';
import { ResponseHandler } from '../middleware/ResponseHandler';

export class LeaveController {
    public static async addLeave(req: Request, res: Response) {
        try {
            const { userID } = req.body.requestUser;
            const { startDate, endDate, reason } = req.body;

            let sanitizedStartDate = sanitizeDate(startDate);
            let sanitizedEndDate = sanitizeDate(endDate);

            if (!sanitizedStartDate || !sanitizedEndDate) {
                throw new Error('Please enter a valid date.');
            }

            if (isBefore(sanitizedStartDate)) {
                throw new Error(
                    'Start date must be not be lesser than present date.'
                );
            }

            if (isBefore(sanitizedEndDate, sanitizedStartDate)) {
                throw new Error(
                    'End date must be not be lesser than start date.'
                );
            }

            const newLeave = await prisma.leave.create({
                data: {
                    startDate: sanitizedStartDate,
                    endDate: sanitizedEndDate,
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
