import axios from 'axios';
import { API_MONGO } from '../config/api';

export const SalesAPI = {
  list: (params = {}) =>
    axios.get(`${API_MONGO}/sales`, { params }).then(r => r.data),

  get: (id) =>
    axios.get(`${API_MONGO}/sales/${id}`).then(r => r.data),

  create: (payload) =>
    axios.post(`${API_MONGO}/sales`, payload).then(r => r.data),

  cancel: (id, payload) =>
    axios.post(`${API_MONGO}/sales/${id}/cancel`, payload).then(r => r.data),

  report: (params = {}) =>
    axios.get(`${API_MONGO}/reports/sales`, { params }).then(r => r.data),
};
