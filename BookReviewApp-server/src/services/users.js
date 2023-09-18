import { client } from '../utils/db.js';

// export async function registration({ name, username, email, password }) {
//   const result = await client.query(`
//     INSERT INTO users (name, username, email, password)
//     VALUES ($1, $2, $3, $4)
//     RETURNING id
//   `, [name, username, email, password]);

//   const newUser = await getById(result.rows[0].id);

//   return newUser;
// }

// export async function login({ email, password }) {
//   const result = await client.query(`
//     SELECT id
//     FROM users
//     WHERE email=$1 AND password=$2
//   `, [email, password]);

//   const user = await getById(result.rows[0].id);

//   return user;
// }

export async function getById(userId) {
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
}

export async function update({
  id, name, username, email, password,
}) {
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
}

export async function updateBookRating({ userId, bookRating }) {
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
}

export async function updateCommentVote({ userId, commentVote }) {
  await client.query(`
    INSERT INTO votes (user_id, comment_id, vote)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, comment_id) DO UPDATE
      SET vote = $3
      --SET vote = EXCLUDED.vote
  `, [userId, commentVote.commentId, commentVote.vote]);

  const updatedUser = await getById(userId);

  return updatedUser;
}
