import { AppError } from '@utils/AppError';
import axios, {
  type AxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
} from 'axios';
import { tokenCreate } from '@storage/auth/tokenCreate';
import { tokenGet } from '@storage/auth/tokenGet';
import {
  PUBLIC_AUTHENTICATE_URL,
  PUBLIC_CLIENT_ID,
  PUBLIC_CLIENT_SECRET,
  PUBLIC_SCOPE,
  PUBLIC_HOSTNAME_NUVEM,
} from '@env';
import { nuvemGet } from '@storage/nuvem/nuvemGet';
import { nuvemCreate } from '@storage/nuvem/nuvemCreate';
import { type NuvemDTO } from '@dtos/NuvemDTO';
import qs from 'qs';

type SignOut = () => void;

interface PromiseType {
  onSucess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

interface APIInstanceProps extends AxiosInstance {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const data = qs.stringify({
  grant_type: 'client_credentials',
  client_id: PUBLIC_CLIENT_ID,
  client_secret: PUBLIC_CLIENT_SECRET,
  scope: PUBLIC_SCOPE,
});

const config: AxiosRequestConfig = {
  url: PUBLIC_AUTHENTICATE_URL,
  method: 'post',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'access-control-allow-origin': '*',
  },
  data,
};

const api = axios.create({
  baseURL: PUBLIC_HOSTNAME_NUVEM,

  data,
}) as APIInstanceProps;

const dataToken = new Promise<NuvemDTO>(async (resolve, reject) => {
  try {
    const data = await nuvemGet();
    resolve(data);
  } catch (error) {
    reject(error);
  }
});

dataToken.then(data => {
  if (data?.access_token) {
    api.defaults.headers.authorization = `Bearer ${data.access_token}`;
  } else {
    axios
      .request(config)
      .then(response => {
        const { access_token, expires_in } = response.data;

        api.defaults.headers.authorization = `Bearer ${access_token}`;

        nuvemCreate({
          access_token,
          expires_in,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
});

// const api = axios.create({
//   // baseURL: 'https://api.olhaaquimt.com.br',
//   baseURL: 'http://192.168.18.97:3333',
// }) as APIInstanceProps;

let failedQueue: PromiseType[] = [];
let isRefreshing = false;

api.registerInterceptTokenManager = (signOut: SignOut) => {
  const interceptTokenManager = api.interceptors.request.use(
    response => response,
    async requestErro => {
      if (requestErro.response.status === 401) {
        if (
          requestErro.response.data.message === 'Token invalid' ||
          requestErro.response.data.message === 'Token expired'
        ) {
          const { refresh_token } = await tokenGet();
          if (!refresh_token) {
            signOut();
            return await Promise.reject(requestErro);
          }
          const originalRequestConfig: AxiosRequestConfig<any> =
            requestErro.config;

          if (isRefreshing) {
            return await new Promise((resolve, reject) => {
              failedQueue.push({
                onSucess: (token: string) => {
                  if (originalRequestConfig.headers) {
                    originalRequestConfig.headers.Authorization = `Bearer ${token}`;
                  }
                  resolve(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }
          isRefreshing = true;

          return await new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post('/users/sessions/refresh_token', {
                refresh_token,
              });
              tokenCreate({
                token: data.token,
                refresh_token: data.refreshToken,
              });

              if (originalRequestConfig.data) {
                originalRequestConfig.data = JSON.parse(
                  originalRequestConfig.data,
                );
              }

              if (originalRequestConfig.headers) {
                originalRequestConfig.headers.Authorization = `Bearer ${data.token}`;
                api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
              }

              failedQueue.forEach(request => {
                request.onSucess(data.token);
              });
              resolve(api(originalRequestConfig));
            } catch (error: any) {
              signOut();
              failedQueue.forEach(promisse => {
                promisse.onFailure(error);
              });
              reject(error);
            } finally {
              isRefreshing = false;
              failedQueue = [];
            }
          });
        }

        signOut();
      }

      if (requestErro.response.data !== null) {
        return await Promise.reject(
          new AppError(String(requestErro.response.data.message)),
        );
      } else {
        return await Promise.reject(requestErro);
      }
    },
  );

  return () => {
    api.interceptors.request.eject(interceptTokenManager);
  };
};

export { api as apiFiscal };
