// import { client } from '../utils/db.js'; // Using node-postgress
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { emailService } from './emailService.js';
import { User } from '../models/User.js';
import { Rating } from '../models/Rating.js';
import { Vote } from '../models/Vote.js';

export function normalize({
  id, name, username, email, booksRating, commentsVote,
}) {
  return {
    id, name, username, email, booksRating, commentsVote,
  };
}

export async function register({ name, username, email, password }) {
  const activationToken = uuidv4();
  const hashedPass = await bcrypt.hash(password, 10);

  await User.create({
    name,
    username,
    email,
    password: hashedPass,
    activationToken,
  });

  await emailService.sendActivationLink(email, activationToken);
}

export async function getByActivationToken(activationToken) {
  return User.findOne({
    attributes: ['id', 'name', 'username', 'email', 'activationToken'],
    where: { activationToken },
    include: [
      {
        model: Rating,
        as: 'booksRating',
        attributes: ['bookId', 'rating'],
      },
      {
        model: Vote,
        as: 'commentsVote',
        attributes: ['commentId', 'vote'],
      },
    ],
  });
}

export async function getByEmail(email) {
  return User.findOne({
    attributes: ['id', 'name', 'username', 'email', 'password'],
    where: { email },
    include: [
      {
        model: Rating,
        as: 'booksRating',
        attributes: ['bookId', 'rating'],
      },
      {
        model: Vote,
        as: 'commentsVote',
        attributes: ['commentId', 'vote'],
      },
    ],
  });
}

export async function getById(userId) {
  return User.findOne({
    attributes: ['id', 'name', 'username', 'email'],
    where: {
      id: userId,
    },
    include: [
      {
        model: Rating,
        as: 'booksRating', // alias that must be defined in User.hasMany(Rating)
        // association: 'booksRating', // instead of providing a model/as pair
        attributes: ['bookId', 'rating'],
      },
      {
        model: Vote,
        as: 'commentsVote',
        // association: 'commentsVote',
        attributes: ['commentId', 'vote'],
      },
    ],
  });

  /* Using node-postgress:
  const user = await client.query(`
    SELECT id, name, username, email
    FROM users
    WHERE id=$1
  `, [userId]);

  const userBooksRating = await client.query(`
    SELECT book_id AS "bookId", rating
    FROM ratings
    WHERE user_id=$1
  `, [userId]);

  const userCommentsVote = await client.query(`
    SELECT comment_id AS "commentId", vote
    FROM votes
    WHERE user_id=$1
  `, [userId]);

  const result = user.rows[0]
    ? {
      ...user.rows[0],
      booksRating: userBooksRating.rows,
      commentsVote: userCommentsVote.rows,
    }
    : null;

  return result;
  */
}

export async function update({
  id, name, username, email, password,
}) {
  await User.update({
    // column: undefined => such column is ignored in query
    name, username, email, password,
  }, {
    where: { id },
  });

  const updatedUser = await getById(id);

  return updatedUser;

  /* Using node-postgress:
  await client.query(`
    UPDATE users SET
      name = COALESCE($2, name),
      username = COALESCE($3, username),
      email = COALESCE($4, email),
      password = COALESCE($5, password)
    WHERE id=$1
  `, [id, name, username, email, password]);

  const updatedUser = await getById(id);

  return updatedUser;
  */
}

export async function updateBookRating({ userId, bookRating }) {
  // Variant 1:
  await Rating.bulkCreate([{
    userId,
    bookId: bookRating.bookId,
    rating: bookRating.rating,
  }], {
    conflictAttributes: ['userId', 'bookId'], // ON CONFLICT(user_id,book_id) DO
    updateOnDuplicate: ['rating', 'updatedAt'],
    validate: true,
  });

  // Variant 2:
  // await Rating.upsert({
  //   userId,
  //   bookId: bookRating.bookId,
  //   rating: bookRating.rating,
  // }, {
  //   conflictFields: ['user_id', 'book_id'],
  //   fields: ['rating'],
  //   validate: true,
  // });

  const updatedUser = await getById(userId);

  return updatedUser;

  /* Using node-postgress:
  // Variant 1
  await client.query(`
    INSERT INTO ratings (user_id, book_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, book_id) DO UPDATE
      SET rating = $3
      --SET rating = EXCLUDED.rating
  `, [userId, bookRating.bookId, bookRating.rating]);

  // Variant 2
  // const isUpdating = await client.query(`
  //   SELECT *
  //   FROM ratings
  //   WHERE user_id=$1 AND book_id=$2
  // `, [userId, bookRating.bookId]);

  // if (isUpdating.rows[0]) {
  //   await client.query(`
  //     UPDATE ratings
  //     SET rating = $3
  //     WHERE user_id=$1 AND book_id=$2
  //   `, [userId, bookRating.bookId, bookRating.rating]);
  // } else {
  //   await client.query(`
  //     INSERT INTO ratings (user_id, book_id, rating)
  //     VALUES ($1, $2, $3)
  //   `, [userId, bookRating.bookId, bookRating.rating]);
  // }

  const updatedUser = await getById(userId);

  return updatedUser;
  */
}

export async function updateCommentVote({ userId, commentVote }) {
  // Variant 1:
  await Vote.upsert({
    userId,
    commentId: commentVote.commentId,
    vote: commentVote.vote,
  }, {
    conflictFields: ['user_id', 'comment_id'],
    fields: ['vote'],
    validate: true,
  });

  // Variant 2:
  // await Vote.bulkCreate([{
  //   userId,
  //   commentId: commentVote.commentId,
  //   vote: commentVote.vote,
  // }], {
  //   conflictAttributes: ['userId', 'commentId'],
  //   updateOnDuplicate: ['vote', 'updatedAt'],
  //   validate: true,
  // });

  const updatedUser = await getById(userId);

  return updatedUser;

  /* Using node-postgress:
  await client.query(`
    INSERT INTO votes (user_id, comment_id, vote)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, comment_id) DO UPDATE
      SET vote = $3
      --SET vote = EXCLUDED.vote
  `, [userId, commentVote.commentId, commentVote.vote]);

  const updatedUser = await getById(userId);

  return updatedUser;
  */
}
