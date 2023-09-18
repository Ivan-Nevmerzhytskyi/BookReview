import { client } from '../utils/httpClient';
import { BookType } from '../common/types/BookType';

export const getBooks = () => {
  return client.get<BookType[]>('/books');
};

export const addBook = (data: Omit<BookType, 'id'>) => {
  return client.post<BookType>('/books', data);
};

export const deleteBook = (id: string) => {
  return client.delete<string>(`/books/${id}`);
};

export const updateBook = (
  { id, ...data }: Partial<BookType> & Pick<BookType, 'id'>,
) => {
  return client.patch<BookType>(`/books/${id}`, data);
};
