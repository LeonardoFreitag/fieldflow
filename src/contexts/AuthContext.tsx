import { type TokenModel } from '@models/TokenModel';
import { type UserAuthModel } from '@models/UserAuthModel';
import { api } from '@services/api';
import { authCreate } from '@storage/auth/authCreate';
import { authDelete } from '@storage/auth/authDelete';
import { authGetAll } from '@storage/auth/authGetAll';
import { tokenCreate } from '@storage/auth/tokenCreate';
import { tokenGet } from '@storage/auth/tokenGet';
import { AppError } from '@utils/AppError';
import { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface AuthContextDataProps {
  user: UserAuthModel | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  loadUserData: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserAuthModel>({} as UserAuthModel);

  async function storageData(user: UserAuthModel, dataToken: TokenModel) {
    setUser(user);

    await authCreate(user);
    await tokenCreate({
      token: dataToken.token,
      refreshToken: dataToken.refreshToken,
    });
  }

  async function signIn(email: string, password: string): Promise<boolean> {
    // console.log('SignIn email:', email, 'password:', password);
    try {
      const response = await api.post<UserAuthModel>('/users/sessions', {
        email,
        password,
      });

      api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      const { token, refreshToken } = response.data;

      await storageData(response.data, { token, refreshToken });

      if (response.status !== 200) {
        return false;
      }
      return true;
    } catch (error) {
      console.log('Error during signIn:', error, error instanceof AppError);
      const isApperror = error instanceof AppError;
      if (isApperror) {
        Alert.alert('Erro', error.message);
      } else {
        const status = (error as any).response
          ? (error as any).response.status
          : null;
        if (status === 401) {
          Alert.alert('Erro', 'Email ou senha inválidos');
        }
        if (status === 402) {
          Alert.alert('Erro', 'Conta não verificada. Verifique seu email');
        }
        if (status === 405) {
          Alert.alert('Erro', 'Conta desativada');
        }
      }
      return false;
    }
  }

  async function signOut() {
    setUser({} as UserAuthModel);
    await authDelete();
  }

  async function loadUserData() {
    const { token, refreshToken } = await tokenGet();
    const currentUser = await authGetAll();

    if (currentUser !== null) {
      api.defaults.headers.common.Authorization = `Bearer ${currentUser.token}`;
      storageData(currentUser, {
        token,
        refreshToken,
      });
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await loadUserData();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);
    return () => {
      subscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, loadUserData, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
