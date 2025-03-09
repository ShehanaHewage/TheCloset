import axios from 'axios';
import { useUserStore } from '../stores/userStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useUserStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;

export function getFileUrlPrefix() {
  return `${import.meta.env.VITE_API_URL}/api/v1/files/`;
}

export function getFileUrl(id: string) {
  return `${getFileUrlPrefix()}${id}`;
}
