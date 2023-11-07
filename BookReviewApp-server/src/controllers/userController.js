import * as userService from '../services/userService.js';

const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;
const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[\W_])(?=.*\d)[a-zA-Z\W_\d]+$/;

export const getOne = async(req, res, next) => {
  const { userId } = req.params;
  const foundUser = await userService.getById(userId);

  if (!foundUser) {
    res.sendStatus(404);

    return;
  }

  res.send(
    userService.normalize(foundUser),
  );
};

export const update = async(req, res, next) => {
  const { userId } = req.params;
  const foundUser = await userService.getById(userId);

  if (!foundUser) {
    res.sendStatus(404);

    return;
  }

  const { name, username, email, password } = req.body;

  if (
    (name !== undefined
      && (typeof name !== 'string' || name.trim().length < 4)
    )
    || (username !== undefined
      && (typeof username !== 'string' || username.trim().length < 4)
    )
    || (email !== undefined
      && (typeof email !== 'string' || !emailPattern.test(email))
    )
    || (password !== undefined && (
      typeof password !== 'string'
      || password.length < 6
      || !passwordPattern.test(password)
    ))
  ) {
    res.sendStatus(422);

    return;
  }

  const updatedUser = await userService.update({
    id: userId, name, username, email, password,
  });

  res.send(
    userService.normalize(updatedUser),
  );
};

export const updateBookRating = async(req, res, next) => {
  const { userId } = req.params;
  const foundUser = await userService.getById(userId);

  if (!foundUser) {
    res.sendStatus(404);

    return;
  }

  const bookRating = req.body;

  if (
    typeof bookRating !== 'object'
    || typeof bookRating.bookId !== 'string'
    || !(
      (typeof bookRating.rating === 'string'
      && bookRating.rating.match(/^[12345]$/))
      || bookRating.rating === null
    )
  ) {
    res.sendStatus(422);

    return;
  }

  const updatedUser = await userService.updateBookRating({
    userId, bookRating,
  });

  res.send(
    userService.normalize(updatedUser),
  );
};

export const updateCommentVote = async(req, res, next) => {
  const { userId } = req.params;
  const foundUser = await userService.getById(userId);

  if (!foundUser) {
    res.sendStatus(404);

    return;
  }

  const commentVote = req.body;

  if (
    typeof commentVote !== 'object'
    || typeof commentVote.commentId !== 'string'
    || !(
      (typeof commentVote.vote === 'string'
      && commentVote.vote.match(/^(like|dislike)$/))
      || commentVote.vote === null
    )
  ) {
    res.sendStatus(422);

    return;
  }

  const updatedUser = await userService.updateCommentVote({
    userId, commentVote,
  });

  res.send(
    userService.normalize(updatedUser),
  );
};
