import config from '@/config';
import axios from 'axios';
import { useUserStore } from '@/stores/useUserStore';

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
        error => {
            // Do something with response error
            return Promise.reject(error);
        },
    );

    return client;
};
