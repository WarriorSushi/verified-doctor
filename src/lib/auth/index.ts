import { createClient } from "@/lib/supabase/server";

export interface AuthUser {
  id: string;
  email: string;
}

/**
 * Get the current authenticated user from Supabase Auth (server-side).
 * Use this in API routes and Server Components.
 */
export async function getAuth(): Promise<{ userId: string | null; user: AuthUser | null }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { userId: null, user: null };
    }

    return {
      userId: user.id,
      user: {
        id: user.id,
        email: user.email || "",
      },
    };
  } catch {
    return { userId: null, user: null };
  }
}

/**
 * Get the current session (server-side).
 * Use getAuth() for most cases - this is for when you need the full session.
 */
export async function getSession() {
  try {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Sign out the current user (server-side action).
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
