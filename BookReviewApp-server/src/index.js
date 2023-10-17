/* eslint-disable no-console */

// nodemailer, jsonwebtoken, bcrypt, cookie-parser
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { router as booksRouter } from './routes/books.js';
import { router as commentsRouter } from './routes/comments.js';
import { router as usersRouter } from './routes/users.js';
import { router as downloadRouter } from './routes/download.js';

// console.clear();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors()); // Enable CORS for all type of requests
app.use(express.static('public')); // Send static files from 'public' directory
// express.text() --> req.body as text
// express.json() --> req.body as json
// express.urlencoded({ extended: true }) --> req.body as object from HTML form
app.use('/books', express.json({ limit: '5mb' }), booksRouter);
app.use('/comments', express.json(), commentsRouter); // request default: 100kb
app.use('/users', express.json(), usersRouter);
app.use('/download', downloadRouter);

// Custom error handler:
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);

  if (res.headersSent) {
    return next(err); // passing the error to the built-in handler
  }

  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
