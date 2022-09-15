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
                    appliedByUserId: userID,
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

    public static async approveLeave(req: Request, res: Response) {
        try {
            const { userID } = req.body.requestUser;
            const { leaveId } = req.params;
            const approveLeave = req.originalUrl.includes('approve');

            const leave = await prisma.leave.update({
                where: {
                    id: +leaveId,
                },
                data: {
                    isApproved: approveLeave,
                    approvedByUserId: approveLeave ? userID : null,
                },
            });

            return ResponseHandler(req, res, {
                leave,
                message: 'Leave approved successfully.',
            });
        } catch (error) {
            return ResponseHandler(req, res, null, error);
        }
    }

    public static async fetchLeave(req: Request, res: Response) {
        try {
            const { userID } = req.body.requestUser;

            const leaves = await prisma.leave.findMany({
                where: {
                    appliedByUserId: userID,
                },
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    appliedByUser: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    approvedByUser: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });

            return ResponseHandler(req, res, {
                leaves,
                message: 'Leaves fetched successfully.',
            });
        } catch (error) {
            return ResponseHandler(req, res, null, error);
        }
    }
}
