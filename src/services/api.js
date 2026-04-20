/**
 * Shared axios instance for all API calls.
 * Base URL and timeout come from constants/apiConfig.js.
 * The request interceptor attaches the JWT from AsyncStorage.
 */

import axios from 'axios';
import { BASE_URL, API_TIMEOUT_MS } from '../constants/apiConfig';
import { getToken } from '../utils/storage';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
