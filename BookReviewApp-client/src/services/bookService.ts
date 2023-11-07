import { httpClient } from '../utils/http/httpClient';
import { BookType } from '../common/types/BookType';

export const getBooks = () => {
  return httpClient.get<any, BookType[]>('/books');
};

export const addBook = (data: Omit<BookType, 'id'>) => {
  return httpClient.post<any, BookType>('/books', data);
};

export const deleteBook = (id: string) => {
  return httpClient.delete<any, string>(`/books/${id}`);
};

export const updateBook = ({
  id,
  ...data
}: Partial<BookType> & Pick<BookType, 'id'>) => {
  return httpClient.patch<any, BookType>(`/books/${id}`, data);
};
