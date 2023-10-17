// import { client } from '../utils/db.js'; // Using node-postgress
import { sequelize } from '../utils/db.js'; // Using Sequelize
import { Book } from '../models/Book.js';
import { Rating } from '../models/Rating.js';

// Data normalization using DTO (Data Transfer Object):
export function normalize({
  id,
  userId,
  coverSrc,
  title,
  author,
  description,
  averageRating,
  numberOfRatings,
}) {
  return {
    id,
    userId,
    coverSrc,
    title,
    author,
    description,
    averageRating,
    numberOfRatings,
  };
}

export async function getAll() {
  const booksModel = await Book.findAll({
    attributes: [
      'id',
      'userId',
      'coverSrc',
      'title',
      'author',
      'description',
      [
        sequelize.fn(
          'COALESCE',
          sequelize.fn(
            'AVG',
            sequelize.cast(sequelize.col('ratings.rating'), 'integer'),
          ),
          0,
        ),
        'averageRating',
      ],
      // Same as above but direct insertion of SQL into the query (sub query):
      // [
      //   sequelize.literal('COALESCE(AVG(ratings.rating::integer), 0)'),
      //   'averageRating',
      // ],
      [
        sequelize.fn('COUNT', sequelize.col('ratings.rating')),
        'numberOfRatings',
      ],
    ],
    where: {
      // col: val <=> col: {[Op.eq]: val} // col=val
      // col: {[Op.is]: null} // col IS NULL
      // col: {[Op.not]: null} // col IS NOT NULL
      // col: {[Op.or]: [val1, val2]} // col=val1 OR col=val2
      // col: {[Op.between]: [val1, val2]} // col BETWEEN val1 AND val2
      // col: {[Op.lt]: val1, [Op.gt]: val2} // col < val1 AND col > val2
      // col: {[Op.or]: {[Op.lt]: val1, [Op.eq]: val2}} // col<val1 OR col=val2
      // col1: val1, col2: val2 <=> [Op.and]: [{col1: val1}, {col2: val2}]
      // [Op.or]: [{col1: val1}, {col2: val2}] // col1=val1 OR col2=val2
      // col: [val1, val2] <> col: {[Op.in]: [val1, val2]} // col IN(val1, val2)
      //   Operators Op: and, or, qe, ne, gt, gte, lt, lte, is, not, between,
      //   notBetween, in, notIn, like, notLike, ....
      // '$NestedModelName.column$': ... // use nested column in 'WHERE'
    },
    include: {
      model: Rating, // <=> include: Rating
      // as: 'alias', // alias that must be defined in Book.hasMany(Rating)
      // association: 'alias', // instead of providing a model/as pair
      // required: false, // default: LEFT JOIN. 'true' => INNER JOIN
      // right: false, // default. When 'true' + required: false=> RIGHT JOIN
      attributes: [], // don't add object or array objects of nestedModel props
    },
    group: ['book.id'],
    order: [['createdAt', 'DESC']], // order by "created_at" in revers direction
    // order: ['col1', ['col2', 'DESC'], ...],
    // order: [sequelize.fn('MAX', sequelize.col(col))], // ORDER BY MAX(col)
    // order: [[NestedModelName, 'column', 'DESC']], // order by nested column
    // order: [[sequelize.literal('averageRating'), 'DESC']], // order by alias
    // limit: number, // how many items will be retrieved by the operation
    // offset: number, // skip the number of results
    // logging: true, // default: display console.log() for such SQL query
  });

  const result = booksModel.map(bookModel => {
    const { averageRating, numberOfRatings, ...rest } = bookModel.toJSON();

    return {
      averageRating: Number(averageRating),
      numberOfRatings: Number(numberOfRatings),
      ...rest,
    };
  });

  return result;

  /* Using node-postgress:
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
  */
}

export async function getById(bookId) {
  const bookModel = await Book.findOne({
    attributes: [
      'id',
      'userId',
      'coverSrc',
      'title',
      'author',
      'description',
      [
        sequelize.fn(
          'COALESCE',
          sequelize.fn(
            'AVG',
            sequelize.cast(sequelize.col('ratings.rating'), 'integer'),
          ),
          0,
        ),
        'averageRating',
      ],
      [
        sequelize.fn('COUNT', sequelize.col('ratings.rating')),
        'numberOfRatings',
      ],
    ],
    where: {
      id: bookId,
    },
    include: {
      model: Rating,
      attributes: [],
    },
    group: ['book.id'],
  });

  const result = bookModel
    ? {
      id: bookModel.toJSON().id,
      userId: bookModel.toJSON().userId,
      coverSrc: bookModel.toJSON().coverSrc,
      title: bookModel.toJSON().title,
      author: bookModel.toJSON().author,
      description: bookModel.toJSON().description,
      averageRating: Number(bookModel.toJSON().averageRating),
      numberOfRatings: Number(bookModel.toJSON().numberOfRatings),
    }
    : null;

  return result;
  // return Book.findByPk(bookId); // row from table by PK or NULL

  /* Using node-postgress:
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
  */
}

export async function create({
  userId, coverSrc, title, author, description,
}) {
  const newBook = await Book.create({
    userId, coverSrc, title, author, description,
  });
  const result = await getById(newBook.id);

  return result;

  /* Using node-postgress:
  // import { v4 as uuidv4 } from 'uuid';
  // const id = uuidv4();

  const result = await client.query(`
    INSERT INTO books (user_id, cover_src, title, author, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `, [userId, JSON.stringify(coverSrc), title, author, description]);

  const newBook = await getById(result.rows[0].id);

  return newBook;
  */
}

export async function remove(bookId) {
  return Book.destroy({
    where: { id: bookId },
  });

  /* Using node-postgress:
  await client.query(`
    DELETE FROM books
    WHERE id=$1
  `, [bookId]);
  */
}

export async function update({
  id, coverSrc, title, author, description,
}) {
  return Book.update({
    // column: undefined => such column is ignored in query
    coverSrc, title, author, description,
  }, {
    where: { id },
  });

  /* Using node-postgress:
  await client.query(`
    UPDATE books SET
      cover_src = COALESCE($2, cover_src),
      title = COALESCE($3, title),
      author = COALESCE($4, author),
      description = COALESCE($5, description)
    WHERE id=$1
  `, [id, JSON.stringify(coverSrc), title, author, description]);
  // If parameterizing null and undefined then both will be converted to null
  */
}

export async function removeMany(ids) {
  // Variant 1:
  return Book.destroy({
    where: {
      id: ids, // <=> id: { [Op.in]: ids, },
    },
  });

  /* Variant 2: Raw query with unnamed parameters
  return sequelize.query(
    `DELETE FROM books WHERE id IN (?)`,
    {
      replacements: [ids],
      type: QueryTypes.BULKDELETE,
    },
  );
  */

  /* Variant 2: Raw query with named parameters
  return sequelize.query(
    `DELETE FROM books WHERE id IN (:ids)`,
    {
      replacements: { ids },
      type: QueryTypes.BULKDELETE,
      logging: console.log, // default: false
    },
  );
  */

  /* Using node-postgress:
  Variant 1: Prevent SQL injection usiing parameterized query
  const indexesString = ids.map((_id, i) => `$${i + 1}`).join(',');

  await client.query(`
    DELETE FROM books
    WHERE id IN (${indexesString})
  `, ids);

  Variant 2: Prevent SQL injection usiing validation of params
  function isUUID(id) {
    const pattern = /^[0-9a-f\-]+$/;

    return pattern.test(id);
  }

  if (!ids.every(isUUID)) {
    throw new Error();
  }

  await client.query(`
    DELETE FROM books
    WHERE id IN (${
      ids.map(id => `'${id}'`).join(',')
    })
  `);
  */
}

export async function updateMany(books) {
  /* Variant 1: Unmanaged transactions:
  const t = await sequelize.transaction();

  try {
    for (const {
      id, coverSrc, title, author, description,
    } of books) {
      await Book.update({ coverSrc, title, author, description }, {
        where: { id },
        transaction: t,
      });
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
  }
  */

  // Variant 2: Managed transactions:
  return sequelize.transaction(async(t) => {
    for (const { id, coverSrc, title, author, description } of books) {
      await Book.update({
        coverSrc, title, author, description,
      }, {
        where: { id },
        transaction: t,
      });
    }
  });

  // This method has a problem when some books have been deleted by another user
  // return Book.bulkCreate(books, {
  //   updateOnDuplicate: [
  //     'coverSrc',
  //     'title',
  //     'author',
  //     'description',
  //     'updatedAt',
  //   ],
  //   validate: true,
  // });

  /* Using node-postgress:
  for (const {
    id, coverSrc, title, author, description,
  } of books) {
    await update(id, coverSrc, title, author, description);
  }
  */
}
