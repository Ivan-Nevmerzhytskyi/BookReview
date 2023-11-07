import express from 'express';
import * as authController from '../controllers/authController.js';
import { catchError } from '../utils/catchError.js';

export const authRouter = express.Router();

authRouter.post('/registration', catchError(authController.register));

authRouter.get(
  '/activation/:activationToken',
  catchError(authController.activate),
);

authRouter.post('/login', catchError(authController.login));
authRouter.get('/logout', catchError(authController.logout));
authRouter.get('/refresh', catchError(authController.refresh));
