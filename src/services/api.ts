import { AppError } from '@utils/AppError';
import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { tokenCreate } from '@storage/auth/tokenCreate';
import { tokenGet } from '@storage/auth/tokenGet';

type SignOut = () => void;

interface PromiseType {
  onSucess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

interface APIInstanceProps extends AxiosInstance {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
  // baseURL: 'https://fieldflow-api.htcode.net',
  baseURL: 'http://192.168.18.168:3335',
}) as APIInstanceProps;

let failedQueue: PromiseType[] = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut: SignOut) => {
  // Interceptor para adicionar token automaticamente nas requisições
  const interceptTokenRequest = api.interceptors.request.use(
    async config => {
      try {
        const { token } = await tokenGet();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        console.log('Error in request interceptor:', error);
        return config;
      }
    },
    async error => await Promise.reject(error),
  );

  // Interceptor para lidar com respostas e refresh do token
  const interceptTokenResponse = api.interceptors.response.use(
    response => response,
    async responseError => {
      const originalRequest = responseError.config;

      if (responseError.response?.status === 401) {
        if (
          responseError.response.data?.message === 'Token invalid' ||
          responseError.response.data?.message === 'Token expired'
        ) {
          const { refreshToken } = await tokenGet();
          if (!refreshToken) {
            signOut();
            return await Promise.reject(responseError);
          }

          if (isRefreshing) {
            return await new Promise((resolve, reject) => {
              failedQueue.push({
                onSucess: (token: string) => {
                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                  }
                  resolve(api(originalRequest));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const { data } = await api.post('/users/sessions/refreshToken', {
              refreshToken,
            });

            await tokenCreate({
              token: data.token,
              refreshToken: data.refreshToken,
            });

            // Atualiza o header da requisição original
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.token}`;
            }

            // Processa a fila de requisições pendentes
            failedQueue.forEach(request => {
              request.onSucess(data.token);
            });

            return await api(originalRequest);
          } catch (error: any) {
            signOut();
            failedQueue.forEach(promise => {
              promise.onFailure(error);
            });
            return await Promise.reject(error);
          } finally {
            isRefreshing = false;
            failedQueue = [];
          }
        }

        signOut();
      }

      if (responseError.response?.data) {
        return await Promise.reject(
          new AppError(String(responseError.response.data.message)),
        );
      } else {
        return await Promise.reject(responseError);
      }
    },
  );

  return () => {
    api.interceptors.request.eject(interceptTokenRequest);
    api.interceptors.response.eject(interceptTokenResponse);
  };
};

export { api };
