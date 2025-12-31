/**
 * Auth module - uses Supabase Auth
 *
 * This file provides backward compatibility for code that imports from test-auth.
 * All API routes and server components should use getAuth() from "@/lib/auth".
 */

// Re-export server-side auth functions
export { getAuth, getSession, signOut } from "./index";

// Keep TestUser type for backward compatibility with existing code
export interface TestUser {
  userId: string;
  email: string;
  name: string;
}

/**
 * @deprecated Use getAuth() instead
 */
export async function getTestUser(): Promise<TestUser | null> {
  // Dynamic import to avoid bundling server code in client
  const { getAuth } = await import("./index");
  const { user } = await getAuth();

  if (!user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    name: "", // Name is stored in profile, not auth
  };
}

/**
 * @deprecated Test auth is no longer used - Supabase Auth handles sessions
 */
export function createTestSession(): TestUser {
  throw new Error("createTestSession is deprecated. Use Supabase Auth signUp/signIn instead.");
}

/**
 * @deprecated Test auth is no longer used
 */
export function isTestAuthEnabled(): boolean {
  return false;
}
