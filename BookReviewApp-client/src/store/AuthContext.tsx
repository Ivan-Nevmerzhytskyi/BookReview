import React, { useMemo, useState } from 'react';
import { UserType } from '../common/types/UserType';
import * as authService from '../services/authService';
import { accessTokenService } from '../services/accessTokenService';

type RegisterUserType = Pick<UserType, 'name' | 'username' | 'email'> & {
  password: string;
};
type LoginUserType = { email: string; password: string };

type ContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  isChecked: boolean;
  checkAuth: () => Promise<void>;
  register: ({
    email,
    name,
    username,
    password,
  }: RegisterUserType) => Promise<void>;
  activate: (activationToken: string) => Promise<void>;
  login: ({ email, password }: LoginUserType) => Promise<void>;
};

export const AuthContext = React.createContext<ContextType>({
  user: null,
  setUser: () => {},
  isChecked: false,
  checkAuth: async () => {},
  register: async () => {},
  activate: async () => {},
  login: async () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const checkAuth = async () => {
    try {
      const dataFromServer = await authService.refresh();

      accessTokenService.save(dataFromServer.accessToken);
      setUser(dataFromServer.user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('User is not authenticated');
    } finally {
      setIsChecked(true);
    }
  };

  const register = async ({
    name, username, email, password,
  }: RegisterUserType) => {
    await authService.register({
      email, name, username, password,
    });
  };

  const activate = async (activationToken: string) => {
    const dataFromServer = await authService.activate(activationToken);

    accessTokenService.save(dataFromServer.accessToken);
    setUser(dataFromServer.user);
  };

  const login = async ({ email, password }: LoginUserType) => {
    const dataFromServer = await authService.login({ email, password });

    accessTokenService.save(dataFromServer.accessToken);

    setUser(dataFromServer.user);
  };

  const logout = async () => {
    await authService.logout();

    accessTokenService.remove();
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isChecked,
      checkAuth,
      register,
      activate,
      login,
      logout,
    }),
    [user, isChecked],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
