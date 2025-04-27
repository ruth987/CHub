import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://51.21.236.223:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

