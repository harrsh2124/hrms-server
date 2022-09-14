import { object, ref, string } from 'yup';

export const UserSignUpRequest = object({
    firstName: string().required('First name is required.'),
    lastName: string().required('Last name is required.'),
    contactNumber: string()
        .required('Contact number is required.')
        .length(10, 'Contact number should be just 10 digits long.'),
    email: string()
        .required('Email is required.')
        .email('Please enter a valid email.'),
    password: string().required('Password is required.'),
    confirmationPassword: string()
        .required('Confirmation password is required.')
        .oneOf(
            [ref('password')],
            'Confirmation password and password must be same.'
        ),
});
