import * as bookService from '../services/books.js';

export const getAll = async(req, res, next) => {
  try {
    const books = await bookService.getAll();

    res.send(books); // automatically determines Content-Type(HTML, JSON)
  } catch (error) {
    next(error);
  }
};

export const getOne = async(req, res, next) => {
  try {
    const { bookId } = req.params;
    const foundBook = await bookService.getById(bookId);

    if (!foundBook) {
      res.sendStatus(404); // send statusCode and text description as an answer

      return;
    }

    res.send(foundBook);
  } catch (error) {
    next(error);
  }
};

export const add = async(req, res, next) => {
  try {
    // add code to chech if user can add new book
    const { userId, coverSrc, title, author, description } = req.body;

    if (
      typeof userId !== 'string' || userId.length === 0
      || !Array.isArray(coverSrc) || coverSrc.length === 0
      || !coverSrc.every(value => (typeof value === 'string'))
      || typeof title !== 'string' || title.length === 0
      || typeof author !== 'string' || author.length === 0
      || typeof description !== 'string' || description.length === 0
    ) {
      res.sendStatus(422);

      return;
    }

    const newBook = await bookService.create({
      userId, coverSrc, title, author, description,
    });

    res.statusCode = 201;
    res.send(newBook);
    // res.status(201).send(newTodo);
  } catch (error) {
    next(error);
  }
};

export const remove = async(req, res, next) => {
  try {
    // add code to chech if user can delete the book
    const { bookId } = req.params;
    const foundBook = await bookService.getById(bookId);

    if (!foundBook) {
      res.sendStatus(404);

      return;
    }

    await bookService.remove(bookId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const update = async(req, res, next) => {
  try {
    // add code to chech if user can update the book
    const { bookId } = req.params;
    const foundBook = await bookService.getById(bookId);

    if (!foundBook) {
      res.sendStatus(404);

      return;
    }

    const { coverSrc, title, author, description } = req.body;

    if (
      (coverSrc !== undefined
        && (!Array.isArray(coverSrc) || coverSrc.length === 0
          || !coverSrc.every(value => (typeof value === 'string'))
        )
      )
      || (title !== undefined
        && (typeof title !== 'string' || title.length === 0)
      )
      || (author !== undefined
        && (typeof author !== 'string' || author.length === 0)
      )
      || (description !== undefined
        && (typeof description !== 'string' || description.length === 0)
      )
    ) {
      res.sendStatus(422);

      return;
    }

    await bookService.update({
      id: bookId, coverSrc, title, author, description,
    });

    const updatedBook = await bookService.getById(bookId);

    res.send(updatedBook);
  } catch (error) {
    next(error);
  }
};

export const removeMany = async(req, res, next) => {
  const { ids } = req.body;

  if (!Array.isArray(ids)) {
    res.sendStatus(422);

    return;
  }

  try {
    await bookService.removeMany(ids);
  } catch (error) {
    res.sendStatus(400);

    return;
  }

  res.sendStatus(204);
};

export const updateMany = async(req, res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    res.sendStatus(422);

    return;
  }

  // Variant 1
  // #region Without a notification to a client about an unsuccessful update
  await bookService.updateMany(items);
  res.sendStatus(200);
  // #endregion

  // Variant 2
  // #region With a notification to a client about an unsuccessful update
  // const results = [];
  // const errors = [];

  // for (const { id, coverSrc, title, author, description } of items) {
  //   const foundBook = await bookService.getById(id);

  //   if (foundBook) {
  //     await bookService.update({
  //       id, coverSrc, title, author, description,
  //     });
  //     results.push({ id, status: 'OK' });
  //   } else {
  //     errors.push({ id, status: 'NOT FOUND' });
  //   }
  // }

  // res.send({ results, errors });
  // #endregion
};
