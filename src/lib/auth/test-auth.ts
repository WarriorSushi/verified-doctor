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
 * Create a test session with custom user data.
 * Generates a unique user ID based on the email to allow testing multiple accounts.
 */
export function createTestSession(params?: {
  email?: string;
  name?: string;
}): TestUser {
  const email = params?.email || process.env.TEST_USER_EMAIL || "test@verified.doctor";
  const name = params?.name || process.env.TEST_USER_NAME || "Dr. Test User";

  // Generate a unique user ID based on email hash
  // This allows testing multiple accounts with different emails
  const userId = `test_user_${simpleHash(email)}`;

  return { userId, email, name };
}

/**
 * Simple hash function to generate consistent IDs from email.
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if test auth is enabled.
 */
export function isTestAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH === "true";
}
