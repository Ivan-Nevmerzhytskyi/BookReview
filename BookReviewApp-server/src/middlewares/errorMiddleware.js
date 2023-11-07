/* eslint-disable no-console */

import { ApiError } from '../exceptions/ApiError.js';

export function errorMiddleware(error, req, res, next) {
  if (error instanceof ApiError) {
    const { status, message, errors } = error;

    res.status(status).send({ message, errors });

    return;
  }

  console.error('Error occurred:', error);

  if (res.headersSent) {
    return next(error); // passing the error to the built-in handler
  }

  res.status(500).send({
    message: 'Unexpected internal Server Error',
  });
}
