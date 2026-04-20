/**
 * User roles for the clinic system.
 * Keep role strings aligned with your MongoDB / Express backend.
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
  RECEPTIONIST: 'receptionist',
};

/** Values used for validation and API payloads */
export const ROLE_VALUES = Object.values(USER_ROLES);

/** Friendly labels for UI (dashboard, profile, viva demos) */
export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.DOCTOR]: 'Doctor',
  [USER_ROLES.PATIENT]: 'Patient',
  [USER_ROLES.RECEPTIONIST]: 'Receptionist',
};

/** Role picker options for the register screen */
export const ROLE_OPTIONS = ROLE_VALUES.map((value) => ({
  value,
  label: ROLE_LABELS[value] || value,
}));

export function isAdmin(role) {
  return role === USER_ROLES.ADMIN;
}
