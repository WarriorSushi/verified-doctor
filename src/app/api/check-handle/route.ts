import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isBannedHandle } from "@/lib/banned-handles";
import {
  getHandleCheckLimiter,
  getClientIp,
  checkRateLimit,
  formatRetryAfter,
} from "@/lib/rate-limit";

const handleSchema = z.object({
  handle: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .max(30, "Handle must be at most 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Handle can only contain lowercase letters, numbers, and hyphens"
    )
    .refine((h) => !h.startsWith("-") && !h.endsWith("-"), {
      message: "Handle cannot start or end with a hyphen",
    })
    .refine((h) => !h.includes("--"), {
      message: "Handle cannot contain consecutive hyphens",
    }),
});

export async function POST(request: Request) {
  try {
    // Rate limiting: 30 checks per IP per minute (prevent enumeration)
    const ip = await getClientIp();
    const limiter = getHandleCheckLimiter();
    const rateLimit = await checkRateLimit(limiter, ip);

    if (!rateLimit.success) {
      const retryAfter = rateLimit.retryAfter || 60; // Default 1 minute
      return NextResponse.json(
        {
          available: false,
          error: `Too many requests. Please try again in ${formatRetryAfter(retryAfter)}.`,
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
    const result = handleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          available: false,
          error: result.error.issues[0]?.message || "Invalid handle format",
        },
        { status: 400 }
      );
    }

    const { handle } = result.data;

    // Check against banned handles
    if (isBannedHandle(handle)) {
      return NextResponse.json({
        available: false,
        error: "This handle is not available",
      });
    }

    // Check if handle exists in database
    const supabase = await createClient();
    const { data: existingProfile, error } = await supabase
      .from("profiles")
      .select("handle")
      .eq("handle", handle)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned (handle is available)
      console.error("Database error:", error);
      return NextResponse.json(
        { available: false, error: "Error checking availability" },
        { status: 500 }
      );
    }

    const available = !existingProfile;

    return NextResponse.json({
      available,
      ...(available
        ? { message: "This handle is available!" }
        : { error: "This handle is already taken" }),
    });
  } catch (error) {
    console.error("Check handle error:", error);
    return NextResponse.json(
      { available: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
