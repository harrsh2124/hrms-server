import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { RequestValidator } from '../middleware/RequestValidator';
import { UserSignInRequest } from '../requests/UserSignInRequest';
import { UserSignUpRequest } from '../requests/UserSignUpRequest';

export const AuthRouter = Router();

AuthRouter.post(
    '/signup',
    RequestValidator(UserSignUpRequest),
    AuthController.signUp
);

AuthRouter.post(
    '/signin',
    RequestValidator(UserSignInRequest),
    AuthController.signIn
);
