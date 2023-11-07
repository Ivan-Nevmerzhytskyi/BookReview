import express from 'express';
import * as bookController from '../controllers/bookController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { catchError } from '../utils/catchError.js';

export const bookRouter = express.Router();

bookRouter.get('/', catchError(bookController.getAll));
bookRouter.get('/:bookId', catchError(bookController.getOne));
bookRouter.post('/', authMiddleware, catchError(bookController.add));

bookRouter.delete(
  '/:bookId',
  // check if user with a given "accessToken" can execute "remove" middleware:
  authMiddleware,
  catchError(bookController.remove),
);

bookRouter.patch(
  '/:bookId',
  authMiddleware,
  catchError(bookController.update),
);

// Function which return a custom middleware:
const hasAction = (action) => {
  return (req, res, next) => {
    // req.query: { key1: ['val_1', 'val_2'], ... }
    if (req.query.action === action) {
      next(); // pass control to the next middleware in the chain
    } else {
      next('route'); // pass control to the next http method of router
    }
  };
};

bookRouter.patch(
  '/',
  hasAction('delete'),
  authMiddleware,
  catchError(bookController.removeMany),
);

bookRouter.patch(
  '/',
  hasAction('update'),
  authMiddleware,
  catchError(bookController.updateMany),
);

bookRouter.patch('/', (req, res) => res.sendStatus(400));
