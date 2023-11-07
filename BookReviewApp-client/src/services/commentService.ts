import { httpClient } from '../utils/http/httpClient';
import { CommentType } from '../common/types/CommentType';

export const getCommentsByBookId = (bookId: string) => {
  return httpClient.get<any, CommentType[]>(`/comments?bookId=${bookId}`);
};

export const addComment = (data: Omit<CommentType, 'id'>) => {
  return httpClient.post<any, CommentType>('/comments', data);
};

export const deleteComment = (id: string) => {
  return httpClient.delete<any, string>(`/comments/${id}`);
};

export const updateComment = ({
  id,
  ...data
}: Partial<CommentType> & Pick<CommentType, 'id'>) => {
  return httpClient.patch<any, CommentType>(`/comments/${id}`, data);
};
