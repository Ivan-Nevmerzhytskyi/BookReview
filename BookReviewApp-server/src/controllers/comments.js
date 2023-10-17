import * as commentService from '../services/comments.js';

export const getAllByBookId = async(req, res, next) => {
  try {
    const { bookId } = req.query;
    const comments = await commentService.getAllByBookId(bookId);

    res.send(
      comments.map(commentService.normalize),
    );
  } catch (error) {
    next(error);
  }
};

export const getAll = async(req, res, next) => {
  try {
    const comments = await commentService.getAll();

    res.send(
      comments.map(commentService.normalize),
    );
  } catch (error) {
    next(error);
  }
};

export const getOne = async(req, res, next) => {
  try {
    const { commentId } = req.params;
    const foundComment = await commentService.getById(commentId);

    if (!foundComment) {
      res.sendStatus(404);

      return;
    }

    res.send(
      commentService.normalize(foundComment),
    );
  } catch (error) {
    next(error);
  }
};

export const add = async(req, res, next) => {
  try {
    // add code to chech if user can add new comment
    const { bookId, username, email, body } = req.body;

    if (
      typeof bookId !== 'string' || bookId.length === 0
      || typeof username !== 'string' || username.length === 0
      || typeof email !== 'string' || email.length === 0
      || typeof body !== 'string' || body.length === 0
    ) {
      res.sendStatus(422);

      return;
    }

    const newComment = await commentService.create({
      bookId, username, email, body,
    });

    res.statusCode = 201;

    res.send(
      commentService.normalize(newComment),
    );
  } catch (error) {
    next(error);
  }
};

export const remove = async(req, res, next) => {
  try {
    // add code to chech if user can delete the comment
    const { commentId } = req.params;
    const foundComment = await commentService.getById(commentId);

    if (!foundComment) {
      res.sendStatus(404);

      return;
    }

    await commentService.remove(commentId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const update = async(req, res, next) => {
  try {
    // add code to chech if user can update the comment
    const { commentId } = req.params;
    const foundComment = await commentService.getById(commentId);

    if (!foundComment) {
      res.sendStatus(404);

      return;
    }

    const { body } = req.body;

    if (body !== undefined && (typeof body !== 'string' || body.length === 0)) {
      res.sendStatus(422);

      return;
    }

    const updatedComment = await commentService.update({ id: commentId, body });

    res.send(
      commentService.normalize(updatedComment),
    );
  } catch (error) {
    next(error);
  }
};
