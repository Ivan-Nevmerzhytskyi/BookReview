import React, { useMemo, useState } from 'react';
import { UserType } from '../common/types/UserType';
import * as userService from '../services/users';

type RegisterUserType =
  Pick<UserType, 'name' | 'username' | 'email'> & { password: string };
type LoginUserType = { email: string, password: string };

type ContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  isChecked: boolean;
  checkAuth: () => Promise<void>;
  register: ({
    email, name, username, password,
  }: RegisterUserType) => Promise<void>;
  login: ({ email, password }: LoginUserType) => Promise<void>;
};

export const AuthContext = React.createContext<ContextType>({
  user: null,
  setUser: () => {},
  isChecked: false,
  checkAuth: async () => {},
  register: async () => {},
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
      // Must be code of authorization and getting user, token from server
      await new Promise(resolve => setTimeout(resolve, 3000));
      const userFromServer = await userService.getUserById('not found');

      setUser(userFromServer);
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
    // Must be code of authorization and getting user, token from server
    // eslint-disable-next-line no-console
    console.log({
      name, username, email, password,
    });

    await new Promise(resolve => setTimeout(resolve, 3000));
    const userFromServer = await userService.getUserById(
      '11111111-1111-1111-1111-111111111111',
    );

    setUser(userFromServer);
  };

  const login = async ({ email, password }: LoginUserType) => {
    // Must be code of authorization and getting user, token from server
    // eslint-disable-next-line no-console
    console.log({ email, password });

    await new Promise(resolve => setTimeout(resolve, 3000));
    const userFromServer = await userService.getUserById(
      '11111111-1111-1111-1111-111111111111',
    );

    setUser(userFromServer);
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      isChecked,
      checkAuth,
      register,
      login,
    }),
    [user, isChecked],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
