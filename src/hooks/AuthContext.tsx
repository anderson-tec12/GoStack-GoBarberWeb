import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/apiClient';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
}

interface SignIncredentials {
  email: string;
  password: string;
}

interface AuthContextState {
  user: User;
  signIn(credencials: SignIncredentials): Promise<void>;
  signOut(): void;
  updateUser(updateData: Partial<User>): void;
}

interface AuthState {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    // console.log('response', response.data);

    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (updateData: Partial<User>) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(updateData));

      setData({
        token: data.token, // permanece o mesmo não atualizo
        user: {
          ...data.user, // joga todas as informaçoes do usuario
          ...updateData, // sobres escreve so o que foi atualizado
        },
      });
    },
    [data.token, data.user],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('UseAuth must be withing a AuthProvider');
  }

  return context;
};
