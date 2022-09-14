import { object, string } from 'yup';

export const NewLeaveRequest = object({
    startDate: string().required('Start date is required.'),
    endDate: string().required('End date is required.'),
    reason: string().required('Reason for leave is required.'),
});
