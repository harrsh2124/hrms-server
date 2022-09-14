import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { verifyJWT } from '../middleware/Auth';

export const UserRouter = Router();

UserRouter.get('/details', UserController.profile);

UserRouter.get('/details/:id', UserController.profile);
