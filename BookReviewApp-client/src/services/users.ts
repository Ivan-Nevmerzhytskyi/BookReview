import { client } from '../utils/httpClient';
import { UserType } from '../common/types/UserType';

type ResponseType = {
  user: UserType;
  accessToken: string;
};

type RegisterUserType =
  Pick<UserType, 'name' | 'username' | 'email'> & { password: string };

type LoginUserType = { email: string, password: string };

export const getUserById = (userId: string) => {
  return client.get<UserType>(`/users/${userId}`);
};

export const updateUser = (
  { id, ...data }: Partial<UserType> & Pick<UserType, 'id'>,
) => {
  return client.patch<UserType>(`/users/${id}`, data);
};

export const updateUserBookRating = (
  userId: string,
  bookRating : { bookId: string; rating: string | null },
) => {
  return client.patch<UserType>(`/users/${userId}?updateType=bookRating`, bookRating);
};

export const updateUserCommentVote = (
  userId: string,
  commentVote : { commentId: string; vote: string | null },
) => {
  return client.patch<UserType>(`/users/${userId}?updateType=commentVote`, commentVote);
};

export const refresh = () => {
  return client.get<ResponseType>('/users/refresh');
};

export const register = ({
  email, name, username, password,
}: RegisterUserType) => {
  return client.post<ResponseType>(
    '/users/registration',
    {
      name, email, username, password,
    },
  );
};

export const login = ({ email, password }: LoginUserType) => {
  return client.post<ResponseType>('/users/login', { email, password });
};

export const logout = () => {
  return client.get<string>('/users/logout');
};

export const activate = (activationToken: string) => {
  return client.get<ResponseType>(`/users/activation/${activationToken}`);
};
