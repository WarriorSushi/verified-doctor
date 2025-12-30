import { cookies } from "next/headers";

const TEST_COOKIE_NAME = "test_auth_session";

export interface TestUser {
  userId: string;
  email: string;
  name: string;
}

/**
 * Get the current authenticated user.
 * In development with test auth enabled, checks for test session cookie.
 * In production, this would integrate with Clerk.
 */
export async function getAuth(): Promise<{ userId: string | null }> {
  // Check for test auth first (development only)
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH === "true") {
    const testUser = await getTestUser();
    if (testUser) {
      return { userId: testUser.userId };
    }
  }

  // In production, integrate with Clerk here
  // For now, return null if no test session
  return { userId: null };
}

/**
 * Get the full test user object from the session cookie.
 */
export async function getTestUser(): Promise<TestUser | null> {
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH !== "true") {
    return null;
  }

  try {
    const cookieStore = await cookies();
    const testSession = cookieStore.get(TEST_COOKIE_NAME);

    if (testSession) {
      return JSON.parse(testSession.value) as TestUser;
    }
  } catch {
    // Cookie parsing failed
  }

  return null;
}

/**
 * Create a test session with default or custom user data.
 */
export function createTestSession(): TestUser {
  return {
    userId: process.env.TEST_USER_ID || "test_user_123",
    email: process.env.TEST_USER_EMAIL || "test@verified.doctor",
    name: process.env.TEST_USER_NAME || "Dr. Test User",
  };
}

/**
 * Check if test auth is enabled.
 */
export function isTestAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH === "true";
}
