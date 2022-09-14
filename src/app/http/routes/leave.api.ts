import { Router } from 'express';
import { LeaveController } from '../controllers/LeaveController';
import { RequestValidator } from '../middleware/RequestValidator';
import { NewLeaveRequest } from '../requests/leave/NewLeaveRequest';

export const LeaveRouter = Router();

LeaveRouter.post(
    '/add',
    RequestValidator(NewLeaveRequest),
    LeaveController.addLeave
);
