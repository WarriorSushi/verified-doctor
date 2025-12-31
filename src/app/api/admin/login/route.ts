import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { validateAdminCredentials, createAdminSession } from "@/lib/admin-auth";
import {
  getAdminLoginLimiter,
  getClientIp,
  checkRateLimit,
  formatRetryAfter,
} from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    // Rate limiting: 5 attempts per IP per 15 minutes
    const ip = await getClientIp();
    const limiter = getAdminLoginLimiter();
    const rateLimit = await checkRateLimit(limiter, ip);

    if (!rateLimit.success) {
      const retryAfter = rateLimit.retryAfter || 900; // Default 15 min
      console.warn(`[admin-login] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        {
          error: `Too many login attempts. Try again in ${formatRetryAfter(retryAfter)}.`,
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid credentials format" },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const isValid = await validateAdminCredentials(email, password);

    if (!isValid) {
      console.warn(`[admin-login] Failed login attempt for email: ${email} from IP: ${ip}`);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createAdminSession();
    const cookieStore = await cookies();

    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
