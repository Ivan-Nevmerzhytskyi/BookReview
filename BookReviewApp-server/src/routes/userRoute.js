import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { catchError } from '../utils/catchError.js';

export const userRouter = express.Router();

userRouter.get('/:userId', catchError(userController.getOne));

userRouter.patch(
  '/:userId',
  hasUpdateType('bookRating'),
  authMiddleware,
  catchError(userController.updateBookRating),
);

userRouter.patch(
  '/:userId',
  hasUpdateType('commentVote'),
  authMiddleware,
  catchError(userController.updateCommentVote),
);

userRouter.patch(
  '/:userId',
  authMiddleware,
  catchError(userController.update),
);

function hasUpdateType(updateType) {
  return (req, res, next) => {
    if (req.query.updateType === updateType) {
      next();
    } else {
      next('route');
    }
  };
}
