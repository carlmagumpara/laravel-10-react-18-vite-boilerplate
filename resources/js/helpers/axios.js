import axios from 'axios';
import { API_URL } from './config';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(async config => {
  const { store } = await import('src/redux/store');
  const token = store.getState()?.token?.value || '';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

instance.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.reject(error);
});

export default instance;