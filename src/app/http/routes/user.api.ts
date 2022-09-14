import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { verifyJWT } from '../middleware/Auth';

export const UserRouter = Router();

UserRouter.get('/details', verifyJWT, UserController.profile);

UserRouter.get('/details/:id', verifyJWT, UserController.profile);
