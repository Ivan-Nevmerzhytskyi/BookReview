import { authClient } from '../utils/http/authClient';
import { UserType } from '../common/types/UserType';

type ResponseType = {
  user: UserType;
  accessToken: string;
};

type RegisterUserType = Pick<UserType, 'name' | 'username' | 'email'> & {
  password: string;
};

type LoginUserType = { email: string; password: string };

export const register = ({
  email,
  name,
  username,
  password,
}: RegisterUserType) => {
  return authClient.post<any, { message: string }>('/registration', {
    name,
    email,
    username,
    password,
  });
};

export const activate = (activationToken: string) => {
  return authClient.get<any, ResponseType>(`/activation/${activationToken}`);
};

export const login = ({ email, password }: LoginUserType) => {
  return authClient.post<any, ResponseType>('/login', { email, password });
};

export const logout = () => {
  return authClient.get<any, string>('/logout');
};

export const refresh = () => {
  return authClient.get<any, ResponseType>('/refresh');
};
