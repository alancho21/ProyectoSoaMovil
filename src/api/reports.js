import axios from 'axios';
import { API_MONGO } from '../config/api';

export const ReportsAPI = {
  sales: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return axios.get(`${API_MONGO}/reports/sales${qs ? `?${qs}` : ''}`)
      .then(r => r.data);
  }
};
