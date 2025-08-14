import axios from 'axios';

export const API_MONGO = import.meta.env.VITE_API_MONGO || 'http://127.0.0.1:8001/api';

export const apiMongo = axios.create({
  baseURL: API_MONGO,
});

apiMongo.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('mongo_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
