/**
 * Authentication API calls (register, login, forgot password).
 * Response shapes differ between student backends — helpers unwrap common formats.
 */

import api from './api';
import { API_PATHS } from '../constants/apiConfig';
import { normalizeUser } from '../utils/helpers';

function pickToken(payload) {
  if (!payload || typeof payload !== 'object') return null;
  return (
    payload.token ||
    payload.accessToken ||
    payload.data?.token ||
    payload.data?.accessToken ||
    null
  );
}

function pickUser(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const raw = payload.user || payload.data?.user;
  if (!raw || typeof raw !== 'object') return null;
  return normalizeUser(raw);
}

/**
 * Register a new user.
 * Sends both `name` and `fullName` so different backends can pick either field.
 */
export async function register({
  fullName,
  email,
  password,
  phone,
  role,
}) {
  const body = {
    name: fullName,
    fullName,
    email,
    password,
    phone,
    role,
  };
  const res = await api.post(API_PATHS.auth.register, body);
  const token = pickToken(res.data);
  const user = pickUser(res.data);
  return { token, user };
}

export async function login({ email, password }) {
  const res = await api.post(API_PATHS.auth.login, { email, password });
  const token = pickToken(res.data);
  const user = pickUser(res.data);
  if (!token || !user) {
    throw new Error('Login response did not include token and user.');
  }
  return { token, user };
}

/**
 * Optional endpoint — many coursework backends skip this.
 * The screen still handles failure gracefully.
 */
export async function forgotPassword({ email }) {
  const res = await api.post(API_PATHS.auth.forgotPassword, { email });
  return res.data;
}
