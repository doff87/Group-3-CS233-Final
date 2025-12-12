import axios from 'axios';

// Base API client for the app. Default baseURL targets the same origin '/api'.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
