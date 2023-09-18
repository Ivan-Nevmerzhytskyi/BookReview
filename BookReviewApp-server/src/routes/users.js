/* eslint-disable max-len */
import express from 'express';
import * as userController from '../controllers/users.js';

export const router = express.Router();

router.get('/refresh', userController.refresh);
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/activation/:activationToken', userController.activate);

router.get('/:userId', userController.getOne);
router.patch('/:userId', hasUpdateType('bookRating'), userController.updateBookRating);
router.patch('/:userId', hasUpdateType('commentVote'), userController.updateCommentVote);
router.patch('/:userId', userController.update);

function hasUpdateType(updateType) {
  return (req, res, next) => {
    if (req.query.updateType === updateType) {
      next();
    } else {
      next('route');
    }
  };
}
