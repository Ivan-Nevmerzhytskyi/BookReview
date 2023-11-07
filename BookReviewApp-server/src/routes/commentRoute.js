import express from 'express';
import * as commentController from '../controllers/commentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { catchError } from '../utils/catchError.js';

export const commentRouter = express.Router();

commentRouter.get(
  '/',
  hasBookId(),
  catchError(commentController.getAllByBookId),
);
commentRouter.get('/', catchError(commentController.getAll));
commentRouter.get('/:commentId', catchError(commentController.getOne));

commentRouter.post('/', authMiddleware, catchError(commentController.add));

commentRouter.delete(
  '/:commentId',
  authMiddleware,
  catchError(commentController.remove),
);

commentRouter.patch(
  '/:commentId',
  authMiddleware,
  catchError(commentController.update),
);

function hasBookId() {
  return (req, res, next) => {
    if (req.query.hasOwnProperty('bookId')) {
      next();
    } else {
      next('route');
    }
  };
}
