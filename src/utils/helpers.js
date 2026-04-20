/**
 * Small shared helpers used across screens and services.
 */

import { ROLE_LABELS } from '../constants/roles';

/**
 * Turn axios (or generic) errors into a short user-facing string.
 */
export function getApiErrorMessage(
  error,
  fallback = 'Something went wrong. Please try again.'
) {
  if (!error) return fallback;
  if (typeof error === 'string') return error;

  const data = error.response?.data;
  const msg =
    (typeof data === 'string' && data) ||
    data?.message ||
    data?.error ||
    data?.msg ||
    error.message;

  if (Array.isArray(msg)) {
    return msg.filter(Boolean).join(' ');
  }

  return typeof msg === 'string' && msg.trim() ? msg.trim() : fallback;
}

/**
 * Pretty role label for headers and dashboard cards.
 */
export function formatRoleLabel(role) {
  if (!role) return 'User';
  return ROLE_LABELS[role] || role;
}

/**
 * Normalize user object from API (handles _id vs id, name vs fullName).
 */
export function normalizeUser(raw) {
  if (!raw) return null;
  const id = raw._id ?? raw.id;
  return {
    id: id != null ? String(id) : undefined,
    fullName: raw.fullName ?? raw.name ?? '',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    role: raw.role ?? '',
    address: raw.address ?? '',
    gender: raw.gender ?? '',
  };
}
