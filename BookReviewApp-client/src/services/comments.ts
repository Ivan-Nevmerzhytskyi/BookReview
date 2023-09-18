import { client } from '../utils/httpClient';
import { CommentType } from '../common/types/CommentType';

export const getCommentsByBookId = (bookId: string) => {
  return client.get<CommentType[]>(`/comments?bookId=${bookId}`);
};

export const addComment = (data: Omit<CommentType, 'id'>) => {
  return client.post<CommentType>('/comments', data);
};

export const deleteComment = (id: string) => {
  return client.delete<string>(`/comments/${id}`);
};

export const updateComment = (
  { id, ...data }: Partial<CommentType> & Pick<CommentType, 'id'>,
) => {
  return client.patch<CommentType>(`/comments/${id}`, data);
};
