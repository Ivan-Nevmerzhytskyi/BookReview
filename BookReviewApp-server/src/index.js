/* eslint-disable no-console */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { authRouter } from './routes/authRoute.js';
import { bookRouter } from './routes/bookRoute.js';
import { commentRouter } from './routes/commentRoute.js';
import { userRouter } from './routes/userRoute.js';
import { downloadRouter } from './routes/downloadRoute.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

// console.clear();

const PORT = process.env.PORT || 5000;
const app = express();

// app.use(cors()); // Enable CORS for all type of requests
app.use(cors({
  origin: process.env.CLIENT_URL, // only from this client
  credentials: true,
}));
app.use(cookieParser());
app.use(express.static('public')); // Send static files from 'public' directory
app.use(express.json({ limit: '5mb' })); // request default: 100kb
// express.json() --> req.body as json
// express.text() --> req.body as text
// express.urlencoded({ extended: true }) --> req.body as object from HTML form
app.use(authRouter);
app.use('/books', bookRouter);
app.use('/comments', commentRouter);
app.use('/users', userRouter);
app.use('/download', downloadRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
