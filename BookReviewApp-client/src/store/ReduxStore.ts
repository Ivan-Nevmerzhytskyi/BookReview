/* eslint-disable import/no-cycle */
import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './features/books';

const store = configureStore({
  reducer: {
    books: booksReducer,
  },
});

// Listen for changes to the state
store.subscribe(() => {
  // console.log(store.getState());
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
