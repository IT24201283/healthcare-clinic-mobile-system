/**
 * Central place for API-related settings.
 * Change BASE_URL to match your Express server (device vs emulator).
 *
 * Tips for university demos:
 * - Android emulator: often use http://10.0.2.2:PORT
 * - iOS simulator: http://localhost:PORT often works
 * - Physical device: use your PC's LAN IP, e.g. http://192.168.1.10:PORT
 */

// TODO: set this to your backend URL (no trailing slash)
export const BASE_URL = 'http://192.168.8.167:5000';

export const API_TIMEOUT_MS = 15000;

/**
 * API path segments (prefix with BASE_URL in services).
 * Keeping paths here avoids typos and makes viva explanation easier.
 */
export const API_PATHS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    // Optional if your backend implements it:
    forgotPassword: '/api/auth/forgot-password',
  },
  users: {
    profile: '/api/users/profile',
    changePassword: '/api/users/change-password',
    list: '/api/users',
    byId: (id) => `/api/users/${id}`,
  },
};

export default {
  BASE_URL,
  API_TIMEOUT_MS,
  API_PATHS,
};
