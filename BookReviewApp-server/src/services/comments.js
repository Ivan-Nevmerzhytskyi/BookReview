// import { client } from '../utils/db.js'; // Using node-postgress
import { sequelize } from '../utils/db.js'; // Using Sequelize
import { Comment } from '../models/Comment.js';
import { Vote } from '../models/Vote.js';
import { User } from '../models/User.js';

export function normalize({
  id, bookId, body, username, email, votes,
}) {
  return {
    id, bookId, body, username, email, votes,
  };
}

export async function getAllByBookId(idOfBook) {
  const commentsModel = await Comment.findAll({
    attributes: [
      'id',
      'bookId',
      'body',
      [
        sequelize.literal(`(SELECT users.username FROM users WHERE users.id=comment.user_id)`),
        'username',
      ],
      [
        sequelize.literal(`(SELECT users.email FROM users WHERE users.id=comment.user_id)`),
        'email',
      ],
      [
        sequelize.literal(`SUM(CASE WHEN votes.vote = 'like' THEN 1 ELSE 0 END)`),
        'like',
      ],
      [
        sequelize.literal(`COUNT(votes.vote) FILTER (WHERE votes.vote = 'dislike')`),
        'dislike',
      ],
    ],
    where: {
      bookId: idOfBook,
    },
    include: {
      model: Vote,
      attributes: [],
    },
    group: ['comment.id'],
    order: [['createdAt', 'DESC']],
  });

  const result = commentsModel.map(commentModel => {
    const {
      id, bookId, body, username, email, like, dislike,
    } = commentModel.toJSON();

    return {
      id,
      bookId,
      body,
      username,
      email,
      votes: { like: Number(like), dislike: Number(dislike) },
    };
  });

  return result;

  /* Using node-postgress:
  const comments = await client.query(`
    SELECT
      comments.id,
      comments.book_id AS "bookId",
      comments.body,
      (SELECT users.username FROM users WHERE users.id=comments.user_id),
      (SELECT users.email FROM users WHERE users.id=comments.user_id),
      SUM(CASE WHEN votes.vote = 'like' THEN 1 ELSE 0 END) AS like,
      COUNT(votes.vote) FILTER (WHERE votes.vote = 'dislike') AS dislike
    FROM comments
    LEFT JOIN votes
    ON comments.id = votes.comment_id
    WHERE comments.book_id=$1
    GROUP BY comments.id
    ORDER BY comments.created_at DESC
  `, [idOfBook]);

  const result = comments.rows.map(({
    id, bookId, body, username, email, like, dislike,
  }) => ({
    id, bookId, body, username, email, votes: { like, dislike },
  }));

  return result;
  */
}

export async function getAll() {
  const commentsModel = await Comment.findAll({
    attributes: [
      'id',
      'bookId',
      'body',
      [
        sequelize.literal(`(SELECT users.username FROM users WHERE users.id=comment.user_id)`),
        'username',
      ],
      [
        sequelize.literal(`(SELECT users.email FROM users WHERE users.id=comment.user_id)`),
        'email',
      ],
      [
        sequelize.literal(`SUM(CASE WHEN votes.vote = 'like' THEN 1 ELSE 0 END)`),
        'like',
      ],
      [
        sequelize.literal(`COUNT(votes.vote) FILTER (WHERE votes.vote = 'dislike')`),
        'dislike',
      ],
    ],
    include: {
      model: Vote,
      attributes: [],
    },
    group: ['comment.id'],
    order: [['createdAt', 'DESC']],
  });

  const result = commentsModel.map(commentModel => {
    const {
      id, bookId, body, username, email, like, dislike,
    } = commentModel.toJSON();

    return {
      id,
      bookId,
      body,
      username,
      email,
      votes: { like: Number(like), dislike: Number(dislike) },
    };
  });

  return result;

  /* Using node-postgress:
  const comments = await client.query(`
    SELECT
      comments.id,
      comments.book_id AS "bookId",
      comments.body,
      (SELECT users.username FROM users WHERE users.id=comments.user_id),
      (SELECT users.email FROM users WHERE users.id=comments.user_id),
      SUM(CASE WHEN votes.vote = 'like' THEN 1 ELSE 0 END) AS like,
      COUNT(votes.vote) FILTER (WHERE votes.vote = 'dislike') AS dislike
    FROM comments
    LEFT JOIN votes
    ON comments.id = votes.comment_id
    GROUP BY comments.id
    ORDER BY comments.created_at DESC
  `);

  const result = comments.rows.map(({
    id, bookId, body, username, email, like, dislike,
  }) => ({
    id, bookId, body, username, email, votes: { like, dislike },
  }));

  return result;
  */
}

export async function getById(commentId) {
  const commentModel = await Comment.findOne({
    attributes: [
      'id',
      'bookId',
      'body',
      [
        sequelize.literal(`(SELECT users.username FROM users WHERE users.id=comment.user_id)`),
        'username',
      ],
      [
        sequelize.literal(`(SELECT users.email FROM users WHERE users.id=comment.user_id)`),
        'email',
      ],
      [
        sequelize.literal(`SUM(CASE WHEN votes.vote = 'like' THEN 1 ELSE 0 END)`),
        'like',
      ],
      [
        sequelize.literal(`COUNT(votes.vote) FILTER (WHERE votes.vote = 'dislike')`),
        'dislike',
      ],
    ],
    where: {
      id: commentId,
    },
    include: {
      model: Vote,
      attributes: [],
    },
    group: ['comment.id'],
  });

  const result = commentModel
    ? {
      id: commentModel.toJSON().id,
      bookId: commentModel.toJSON().bookId,
      body: commentModel.toJSON().body,
      username: commentModel.toJSON().username,
      email: commentModel.toJSON().email,
      votes: {
        like: Number(commentModel.toJSON().like),
        dislike: Number(commentModel.toJSON().dislike),
      },
    }
    : null;

  return result;

  /* Using node-postgress:
  const comment = await client.query(`
    SELECT
      comments.id,
      comments.book_id AS "bookId",
      comments.body,
      (SELECT users.username FROM users WHERE users.id=comments.user_id),
      (SELECT users.email FROM users WHERE users.id=comments.user_id),
      SUM(CASE WHEN votes.vote = 'like' THEN 1 ELSE 0 END) AS like,
      COUNT(votes.vote) FILTER (WHERE votes.vote = 'dislike') AS dislike
    FROM comments
    LEFT JOIN votes
    ON comments.id = votes.comment_id
    WHERE comments.id=$1
    GROUP BY comments.id
  `, [commentId]);

  const result = comment.rows[0]
    ? {
      id: comment.rows[0].id,
      bookId: comment.rows[0].bookId,
      body: comment.rows[0].body,
      username: comment.rows[0].username,
      email: comment.rows[0].email,
      votes: {
        like: comment.rows[0].like,
        dislike: comment.rows[0].dislike,
      },
    }
    : null;

  return result;
  */
}

export async function create({ bookId, username, email, body }) {
  const user = await User.findOne({
    attributes: ['id'],
    where: { username, email },
  });

  const newComment = await Comment.create({
    bookId,
    userId: user.id,
    body,
  });

  const result = await getById(newComment.id);

  return result;

  /* Using node-postgress:
  const result = await client.query(`
    INSERT INTO comments (book_id, user_id, body)
    VALUES (
      $1,
      (SELECT users.id FROM users WHERE users.username=$2 AND users.email=$3),
      $4
    )
    RETURNING id
  `, [bookId, username, email, body]);

  const newComment = await getById(result.rows[0].id);

  return newComment;
  */
}

export async function remove(commentId) {
  return Comment.destroy({
    where: { id: commentId },
  });

  /* Using node-postgress:
  await client.query(`
    DELETE FROM comments
    WHERE id=$1
  `, [commentId]);
  */
}

export async function update({ id, body }) {
  await Comment.update({ body }, { where: { id } });

  const updatedComment = await getById(id);

  return updatedComment;

  /* Using node-postgress:
  await client.query(`
    UPDATE comments
    SET body = COALESCE($2, body)
    WHERE id=$1
  `, [id, body]);

  const updatedComment = await getById(id);

  return updatedComment;
  */
}
