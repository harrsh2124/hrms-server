import bcrypt from 'bcryptjs';
import { prisma } from '../../../providers/db';

export const UserSignUp = async (props: Props) => {
    const { email, password, contactNumber, firstName, lastName } = props;

    const encryptedPassword = bcrypt.hashSync(password);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: encryptedPassword,
            contactNumber,
            firstName,
            lastName,
        },
    });

    return newUser;
};

type Props = {
    email: string;
    password: string;
    contactNumber: string;
    firstName: string;
    lastName: string;
};