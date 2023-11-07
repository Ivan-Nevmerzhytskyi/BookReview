import { httpClient } from '../utils/http/httpClient';
import { UserType } from '../common/types/UserType';

export const getUserById = (userId: string) => {
  return httpClient.get<any, UserType>(`/users/${userId}`);
};

export const updateUser = ({
  id,
  ...data
}: Partial<UserType> & Pick<UserType, 'id'>) => {
  return httpClient.patch<any, UserType>(`/users/${id}`, data);
};

export const updateUserBookRating = (
  userId: string,
  bookRating: { bookId: string; rating: string | null },
) => {
  return httpClient.patch<any, UserType>(
    `/users/${userId}?updateType=bookRating`,
    bookRating,
  );
};

export const updateUserCommentVote = (
  userId: string,
  commentVote: { commentId: string; vote: string | null },
) => {
  return httpClient.patch<any, UserType>(
    `/users/${userId}?updateType=commentVote`,
    commentVote,
  );
};
