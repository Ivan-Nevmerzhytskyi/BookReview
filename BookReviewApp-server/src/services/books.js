// #region Using node-postgress
import { client } from '../utils/db.js';
// #endregion

export async function getAll() {
  const result = await client.query(`
    SELECT
      books.id,
      books.user_id AS "userId",
      books.cover_src AS "coverSrc",
      books.title,
      books.author,
      books.description,
      COALESCE(AVG(ratings.rating::integer), 0) AS "averageRating",
      COUNT(ratings.rating) AS "numberOfRatings"
    FROM books
    LEFT JOIN ratings
    ON books.id = ratings.book_id
    GROUP BY books.id
    ORDER BY books.created_at DESC
  `);

  return result.rows;
}

export async function getById(bookId) {
  const result = await client.query(`
    SELECT
      books.id,
      books.user_id AS "userId",
      books.cover_src AS "coverSrc",
      books.title,
      books.author,
      books.description,
      COALESCE(AVG(ratings.rating::integer), 0) AS "averageRating",
      COUNT(ratings.rating) AS "numberOfRatings"
    FROM books
    LEFT JOIN ratings
    ON books.id = ratings.book_id
    WHERE books.id=$1
    GROUP BY books.id
  `, [bookId]);

  return result.rows[0] || null;
}

export async function create({
  userId, coverSrc, title, author, description,
}) {
  // import { v4 as uuidv4 } from 'uuid';
  // const id = uuidv4();

  const result = await client.query(`
    INSERT INTO books (user_id, cover_src, title, author, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [userId, JSON.stringify(coverSrc), title, author, description]);

  const newBook = await getById(result.rows[0].id);

  return newBook;
}

export async function remove(bookId) {
  await client.query(`
    DELETE FROM books
    WHERE id=$1
  `, [bookId]);
}

export async function update({
  id, coverSrc, title, author, description,
}) {
  await client.query(`
    UPDATE books SET
      cover_src = COALESCE($2, cover_src),
      title = COALESCE($3, title),
      author = COALESCE($4, author),
      description = COALESCE($5, description)
    WHERE id=$1
  `, [id, JSON.stringify(coverSrc), title, author, description]);
  // If parameterizing null and undefined then both will be converted to null
}

export async function removeMany(ids) {
  // #region Variant 1: Prevent SQL injection usiing parameterized query
  const indexesString = ids.map((_id, i) => `$${i + 1}`).join(',');

  await client.query(`
    DELETE FROM books
    WHERE id IN (${indexesString})
  `, ids);
  // #endregion

  // #region Variant 2: Prevent SQL injection usiing validation of params
  // function isValidID(id) {
  //   const pattern = /^[0-9a-f\-]+$/;

  //   return pattern.test(id);
  // }

  // if (!ids.every(isValidID)) {
  //   throw new Error();
  // }

  // await client.query(`
  //   DELETE FROM books
  //   WHERE id IN (${
  //     ids.map(id => `'${id}'`).join(',')
  //   })
  // `);
  // #endregion
}

export async function updateMany(books) {
  for (const {
    id, coverSrc, title, author, description,
  } of books) {
    await update(id, coverSrc, title, author, description);
  }
}
