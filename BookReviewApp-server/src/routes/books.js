import express from 'express';
import * as bookController from '../controllers/books.js';

export const router = express.Router();

router.get('/', bookController.getAll);
router.get('/:bookId', bookController.getOne);
router.post('/', bookController.add);
router.delete('/:bookId', bookController.remove);
router.patch('/:bookId', bookController.update);

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

router.patch('/', hasAction('delete'), bookController.removeMany);
router.patch('/', hasAction('update'), bookController.updateMany);
router.patch('/', (req, res) => res.sendStatus(400));
