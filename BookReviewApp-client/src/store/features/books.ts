/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppDispatch } from '../ReduxStore';
import { BookType } from '../../common/types/BookType';
import * as bookService from '../../services/bookService';

type BooksState = {
  books: BookType[];
  loading: boolean;
  errorMessage: string;
};

const initialState: BooksState = {
  books: [],
  loading: false,
  errorMessage: '',
};

export const getBooks = createAsyncThunk(
  'books/getBooks',
  () => bookService.getBooks(),
);

export const addBook = createAsyncThunk(
  'books/addBook',
  (newBook: Omit<BookType, 'id'>) => {
    return bookService.addBook(newBook);
  },
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async (bookChanges: Partial<BookType> & Pick<BookType, 'id'>) => {
    const updatedBook = await bookService.updateBook(bookChanges);

    return updatedBook;
  },
);

// export const deleteBook = createAsyncThunk(
//   'books/deleteBook',
//   async (id: string) => {
//     await bookService.deleteBook(id);

//     return id;
//   },
// );

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<BookType[]>) => {
      state.books = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.books = action.payload;
        state.loading = false;
      })
      .addCase(getBooks.rejected, (state) => {
        state.loading = false;
        state.errorMessage = 'Unable to load books';
      });

    builder.addCase(addBook.fulfilled, (state, action) => {
      state.books.push(action.payload);
    });

    builder.addCase(updateBook.fulfilled, (state, action) => {
      const apdatedBook = action.payload;
      const index = state.books.findIndex(book => book.id === apdatedBook.id);

      state.books.splice(index, 1, apdatedBook);
    });

    // builder.addCase(deleteBook.fulfilled, (state, action) => {
    //   state.books = state.books.filter(book => book.id !== action.payload);
    // });
  },
});

export default booksSlice.reducer;
export const { setBooks } = booksSlice.actions;

// Delete a book and render, then in case of a server error
// return the previous array of books before deletion and render
export const deleteBook = (bookId: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const prevBooks = getState().books.books;

    dispatch(setBooks(
      prevBooks.filter(book => book.id !== bookId),
    ));

    try {
      await bookService.deleteBook(bookId);
    } catch (error) {
      dispatch(setBooks(prevBooks));

      throw error;
    }
  };
};
