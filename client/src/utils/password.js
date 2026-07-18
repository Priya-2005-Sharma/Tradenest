/**
 * Mirrors the server's password rules (server/src/validators/auth.validators.js)
 * so the UI can show problems before a round trip. The server remains the
 * authority — this is a convenience, not a substitute.
 */
export const passwordChecks = (value = '') => [
  { label: 'At least 8 characters', ok: value.length >= 8 },
  { label: 'Contains a letter', ok: /[a-zA-Z]/.test(value) },
  { label: 'Contains a number', ok: /[0-9]/.test(value) },
];

export const passwordMeetsRules = (value) => passwordChecks(value).every((check) => check.ok);
