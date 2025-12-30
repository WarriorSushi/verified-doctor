/**
 * List of banned/reserved handles that cannot be claimed.
 * Includes system routes, offensive terms, and reserved words.
 */
export const BANNED_HANDLES = [
  // System routes
  "admin",
  "api",
  "dashboard",
  "sign-in",
  "sign-up",
  "login",
  "logout",
  "register",
  "settings",
  "profile",
  "account",
  "help",
  "support",
  "contact",
  "about",
  "terms",
  "privacy",
  "onboarding",
  "verify",
  "verified",
  "verification",

  // Reserved
  "doctor",
  "doctors",
  "medical",
  "health",
  "healthcare",
  "hospital",
  "clinic",
  "patient",
  "patients",
  "www",
  "mail",
  "email",
  "ftp",
  "localhost",
  "root",
  "null",
  "undefined",
  "test",
  "demo",
  "example",

  // Common offensive terms (basic list)
  "admin",
  "moderator",
  "mod",
  "staff",
  "official",
];

/**
 * Check if a handle is banned/reserved.
 */
export function isBannedHandle(handle: string): boolean {
  return BANNED_HANDLES.includes(handle.toLowerCase());
}
