/**
 * Thin wrapper around AsyncStorage for auth data.
 * Screens should not read/write raw keys — use these helpers instead.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'clinic_auth_token',
  AUTH_USER: 'clinic_auth_user',
};

export async function saveToken(token) {
  if (token == null || token === '') {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, String(token));
}

export async function getToken() {
  return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export async function saveUser(user) {
  if (user == null) {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    return;
  }
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
}

export async function getUser() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearAuth() {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.AUTH_USER,
  ]);
}
