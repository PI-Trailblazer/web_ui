import config from '@/config';
import axios from 'axios';
import { useUserStore } from '@/stores/useUserStore';


let isRefreshing = false;
let refreshSubscribers = [];

/** Add new pending request to wait for a new access token. */
function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}
  
  /** Resolve all pending requests with the new access token. */
function processQueue(token = null) {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
}

export async function refreshToken() {
    return await axios
      .create({
        baseURL: config.API_USER_URL,
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${useUserStore.getState().token}`,
        },
    })
    .post("/refresh")
    .then(({ data: { access_token } }) => {
      useUserStore.getState().login(access_token);
      return access_token;
    })
    .catch(() => {
      useUserStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    });
}

export const createClient = (baseUrl: string) => {
    const client = axios.create({
        baseURL: baseUrl,
        timeout: 5000,
    });

    client.interceptors.request.use(
        config => {
            // Do something before request is sent
            config.headers.Authorization = `Bearer ${useUserStore.getState().token}`;
            return config;
        },
        error => {
            // Do something with request error
            return Promise.reject(error);
        },
    );

    client.interceptors.response.use(
        response => {
            // Do something with response data
            return response;
        },
        async error => {
            const { response, config } = error;
            // Do something with response error
            if(response?.status === 401 && !config.retry) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    const token = await refreshToken();
                    processQueue(token);
                    isRefreshing = false;

                    if (token) {
                        config.retry = true;
                        return axios.request(config);
                    } else {
                        window.location.href = '/login';
                        return Promise.reject("Session expired");
                    }    
                } else {
                    return new Promise((resolve) => {
                        subscribeTokenRefresh((token) => {
                            config.headers.Authorization = `Bearer ${token}`;
                            resolve(axios.request(config));
                        });
                    });
                }
            } else if (response?.status === 401) {
                window.location.href = '/login'; // Redireciona para a página de login
            }
            return Promise.reject(error);
        },
    );

    return client;
};
