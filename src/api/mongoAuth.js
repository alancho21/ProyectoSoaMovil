

// src/api/mongoAuth.js
import axios from 'axios';
import { API_MONGO } from '../config/api';

export async function mongoLogin(email, password) {
  const { data } = await axios.post(`${API_MONGO}/login`, { email, password });
  return data; // { token, user }
}

export async function mongoRegister(payload) {
  // payload: { name, email, password, role }
  const { data } = await axios.post(`${API_MONGO}/register`, payload);
  return data; // { user } o lo que devuelva tu API
}



/*import { apiMongo } from './client-mongo';

export const mongoLogin    = (email, password) => apiMongo.post('/login',    { email, password }).then(r => r.data);
export const mongoRegister = (payload)         => apiMongo.post('/register',  payload).then(r => r.data);
export const mongoMe       = ()                => apiMongo.get('/me').then(r => r.data);
export const mongoLogout   = ()                => apiMongo.post('/logout').then(r => r.data);
*/