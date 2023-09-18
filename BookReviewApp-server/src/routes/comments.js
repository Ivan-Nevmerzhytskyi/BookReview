import express from 'express';
import * as commentController from '../controllers/comments.js';

export const router = express.Router();

router.get('/', hasBookId(), commentController.getAllByBookId);
router.get('/', commentController.getAll);
router.get('/:commentId', commentController.getOne);
router.post('/', commentController.add);
router.delete('/:commentId', commentController.remove);
router.patch('/:commentId', commentController.update);

function hasBookId() {
  return (req, res, next) => {
    if (req.query.hasOwnProperty('bookId')) {
      next();
    } else {
      next('route');
    }
  };
}
