import { client } from '../utils/db.js';

export async function getAllByBookId(idOfBook) {
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
}

export async function getAll() {
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
}

export async function getById(commentId) {
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
}

export async function create({ bookId, username, email, body }) {
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
}

export async function remove(commentId) {
  await client.query(`
    DELETE FROM comments
    WHERE id=$1
  `, [commentId]);
}

export async function update({ id, body }) {
  await client.query(`
    UPDATE comments
    SET body = COALESCE($2, body)
    WHERE id=$1
  `, [id, body]);

  const updatedUser = await getById(id);

  return updatedUser;
}
