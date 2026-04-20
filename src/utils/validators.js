/**
 * Simple validation helpers for forms (login, register, profile, etc.).
 * Each function returns { valid: boolean, message?: string } so screens
 * can show friendly errors under inputs.
 */

// Basic email pattern — good enough for coursework / demos
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Digits only, optional leading + for country code style input
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

/**
 * Trim and check non-empty string.
 */
export function validateRequired(value, fieldLabel = 'This field') {
  const trimmed = typeof value === 'string' ? value.trim() : value;
  if (trimmed === undefined || trimmed === null || trimmed === '') {
    return { valid: false, message: `${fieldLabel} is required.` };
  }
  return { valid: true };
}

/**
 * Email format check.
 */
export function validateEmail(email) {
  const required = validateRequired(email, 'Email');
  if (!required.valid) return required;
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }
  return { valid: true };
}

/**
 * Password minimum length (assignment rule: at least 6).
 */
export function validatePassword(password, minLength = 6) {
  const required = validateRequired(password, 'Password');
  if (!required.valid) return required;
  if (password.length < minLength) {
    return {
      valid: false,
      message: `Password must be at least ${minLength} characters.`,
    };
  }
  return { valid: true };
}

/**
 * Confirm password must match password.
 */
export function validateConfirmPassword(password, confirmPassword) {
  const required = validateRequired(confirmPassword, 'Confirm password');
  if (!required.valid) return required;
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match.' };
  }
  return { valid: true };
}

/**
 * Phone: digits only (optional + prefix), reasonable length for coursework.
 */
export function validatePhone(phone) {
  const required = validateRequired(phone, 'Phone number');
  if (!required.valid) return required;
  const normalized = phone.replace(/\s/g, '');
  if (!PHONE_REGEX.test(normalized)) {
    return {
      valid: false,
      message: 'Enter a valid phone number (digits only, 7–15 digits).',
    };
  }
  return { valid: true };
}

import { ROLE_VALUES } from '../constants/roles';

/**
 * Role must be one of the app roles (matches backend enum / constants).
 */
export function validateRole(role) {
  const required = validateRequired(role, 'Role');
  if (!required.valid) return required;
  if (!ROLE_VALUES.includes(role)) {
    return { valid: false, message: 'Please select a valid role.' };
  }
  return { valid: true };
}

/**
 * Optional field: if empty, valid; if filled, run validator.
 */
export function validateOptional(value, validatorFn) {
  if (value === undefined || value === null) return { valid: true };
  const str = typeof value === 'string' ? value.trim() : value;
  if (str === '') return { valid: true };
  return validatorFn(value);
}

/**
 * Run multiple validators; stops at first failure.
 */
export function runValidators(...results) {
  for (const r of results) {
    if (!r.valid) return r;
  }
  return { valid: true };
}
