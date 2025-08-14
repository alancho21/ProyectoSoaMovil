import axios from 'axios';
import { API_MONGO } from '../config/api';
import axios from 'axios';
import { API_PHP } from '../config/api';
import { apiPHP } from './client-php';
export const loginRequest = (email,password)=> apiPHP.post('/login',{email,password}).then(r=>r.data);
export const meRequest    = ()=> apiPHP.get('/me').then(r=>r.data);

export const apiPHP = axios.create({ baseURL: API_PHP });
apiPHP.interceptors.request.use((cfg)=>{const t=localStorage.getItem('token'); if(t) cfg.headers.Authorization=`Bearer ${t}`; return cfg;});


export const UsersAPI = {
  list:   () => axios.get(`${API_MONGO}/users`).then(r => r.data),
  get:    (id) => axios.get(`${API_MONGO}/users/${id}`).then(r => r.data),
  create: (dto) => axios.post(`${API_MONGO}/users`, dto).then(r => r.data),
  update: (id, dto) => axios.put(`${API_MONGO}/users/${id}`, dto).then(r => r.data),
  remove: (id) => axios.delete(`${API_MONGO}/users/${id}`).then(r => r.data),
  assignRole: (id, role) => axios.put(`${API_MONGO}/users/${id}/assign-role`, { role }).then(r => r.data),
};

