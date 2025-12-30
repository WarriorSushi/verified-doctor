import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createTestSession } from "@/lib/auth/test-auth";

export async function POST(request: Request) {
  // Only allow in development with test auth enabled
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH !== "true") {
    return NextResponse.json(
      { error: "Test auth not enabled" },
      { status: 403 }
    );
  }

  // Parse request body for email and name
  let email: string | undefined;
  let name: string | undefined;

  try {
    const body = await request.json();
    email = body.email;
    name = body.name;
  } catch {
    // No body or invalid JSON - use defaults
  }

  const testUser = createTestSession({ email, name });
  const cookieStore = await cookies();

  cookieStore.set("test_auth_session", JSON.stringify(testUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return NextResponse.json({ success: true, user: testUser });
}
