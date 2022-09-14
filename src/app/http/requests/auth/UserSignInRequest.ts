import { object, ref, string } from 'yup';

export const UserSignInRequest = object({
    email: string()
        .required('Email is required.')
        .email('Please enter a valid email.'),
    password: string().required('Password is required.'),
});
