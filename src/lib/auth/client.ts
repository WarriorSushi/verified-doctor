import { createClient as createBrowserClient } from "@/lib/supabase/client";

/**
 * Client-side auth helpers using Supabase Auth
 * Use these in client components ("use client")
 */

/**
 * Sign in with Google OAuth (client-side).
 * Redirects to Google, then back to your app.
 */
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = createBrowserClient();

  // Determine where to redirect after auth
  const callbackUrl = new URL("/auth/callback", window.location.origin);
  if (redirectTo) {
    callbackUrl.searchParams.set("redirect", redirectTo);
  }

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });
}

/**
 * Sign up with email and password (client-side).
 * After email confirmation, user is redirected to /confirm page.
 */
export async function signUp(email: string, password: string, metadata?: { full_name?: string }) {
  const supabase = createBrowserClient();

  // Redirect to confirm page after email verification
  const confirmUrl = new URL("/confirm", window.location.origin);

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: confirmUrl.toString(),
    },
  });
}

/**
 * Sign in with email and password (client-side).
 */
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient();
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Sign out (client-side).
 */
export async function signOut() {
  const supabase = createBrowserClient();
  return supabase.auth.signOut();
}

/**
 * Get current user (client-side).
 */
export async function getUser() {
  const supabase = createBrowserClient();
  return supabase.auth.getUser();
}

/**
 * Subscribe to auth state changes (client-side).
 */
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  const supabase = createBrowserClient();
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Resend confirmation email (client-side).
 */
export async function resendConfirmationEmail(email: string) {
  const supabase = createBrowserClient();
  return supabase.auth.resend({
    type: "signup",
    email,
  });
}
