/**
 * User profile and admin user management API calls.
 */

import api from './api';
import { API_PATHS } from '../constants/apiConfig';
import { normalizeUser } from '../utils/helpers';

function pickProfilePayload(data) {
  if (!data) return null;
  if (data.user) return data.user;
  if (data.data?.user) return data.data.user;
  return data.data || data;
}

export async function fetchProfile() {
  const res = await api.get(API_PATHS.users.profile);
  const raw = pickProfilePayload(res.data);
  return normalizeUser(raw);
}

export async function updateProfile({
  fullName,
  email,
  phone,
  address,
  gender,
}) {
  const body = {
    name: fullName,
    fullName,
    email,
    phone,
    address,
    gender,
  };
  const res = await api.put(API_PATHS.users.profile, body);
  const raw = pickProfilePayload(res.data);
  return normalizeUser(raw);
}

export async function changePassword({
  currentPassword,
  newPassword,
}) {
  const res = await api.put(API_PATHS.users.changePassword, {
    currentPassword,
    newPassword,
  });
  return res.data;
}

function mapUserListItem(raw) {
  return normalizeUser(raw);
}

export async function fetchUsers() {
  const res = await api.get(API_PATHS.users.list);
  const body = res.data;
  const list =
    body.users ||
    body.data?.users ||
    body.data ||
    (Array.isArray(body) ? body : []);
  if (!Array.isArray(list)) return [];
  return list.map(mapUserListItem).filter(Boolean);
}

export async function fetchUserById(id) {
  const res = await api.get(API_PATHS.users.byId(id));
  const raw =
    res.data.user || res.data.data?.user || res.data.data || res.data;
  return normalizeUser(raw);
}
