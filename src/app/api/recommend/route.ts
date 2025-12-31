import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import {
  getRecommendationLimiter,
  getClientIp,
  checkRateLimit,
} from "@/lib/rate-limit";

const recommendSchema = z.object({
  profileId: z.string().uuid("Invalid profile ID"),
});

// Rate limit window for same IP recommending same profile (24 hours in milliseconds)
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

// More robust fingerprint that includes IP address and additional browser hints
function getFingerprint(headersList: Headers, ip: string): string {
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const acceptEncoding = headersList.get("accept-encoding") || "";
  const secChUa = headersList.get("sec-ch-ua") || ""; // Browser hint
  const secChUaPlatform = headersList.get("sec-ch-ua-platform") || ""; // OS hint
  const secChUaMobile = headersList.get("sec-ch-ua-mobile") || ""; // Mobile hint

  // Create a more robust hash including IP for uniqueness
  const data = `${ip}|${userAgent}|${acceptLanguage}|${acceptEncoding}|${secChUa}|${secChUaPlatform}|${secChUaMobile}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = recommendSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const { profileId } = result.data;

    // Get IP and fingerprint
    const headersList = await headers();
    const ip = await getClientIp();
    const fingerprint = getFingerprint(headersList, ip);

    // Rate limiting: 1 recommendation per IP per profile per 24 hours
    // Combine IP and profileId for per-profile rate limiting
    const limiter = getRecommendationLimiter();
    const rateLimitKey = `${ip}:${profileId}`;
    const rateLimit = await checkRateLimit(limiter, rateLimitKey);

    if (!rateLimit.success) {
      return NextResponse.json({
        success: true,
        alreadyRecommended: true,
        message: "You've already recommended this doctor today",
      });
    }

    const supabase = await createClient();

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", profileId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Check for existing recommendation from this fingerprint
    const { data: existingByFingerprint } = await supabase
      .from("recommendations")
      .select("id")
      .eq("profile_id", profileId)
      .eq("fingerprint", fingerprint)
      .single();

    if (existingByFingerprint) {
      return NextResponse.json({
        success: true,
        alreadyRecommended: true,
        message: "You've already recommended this doctor",
      });
    }

    // ADDITIONAL CHECK: Rate limit by IP address within 24 hours in database
    // This provides a backup check even if Redis rate limiter fails or is bypassed
    const twentyFourHoursAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    const { data: existingByIp } = await supabase
      .from("recommendations")
      .select("id")
      .eq("profile_id", profileId)
      .eq("ip_address", ip)
      .gte("created_at", twentyFourHoursAgo)
      .single();

    if (existingByIp) {
      return NextResponse.json({
        success: true,
        alreadyRecommended: true,
        message: "You've already recommended this doctor recently",
      });
    }

    // Create recommendation
    const { error: insertError } = await supabase
      .from("recommendations")
      .insert({
        profile_id: profileId,
        fingerprint,
        ip_address: ip,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to submit recommendation" },
        { status: 500 }
      );
    }

    // Increment recommendation count
    await supabase.rpc("increment_recommendation_count", { profile_uuid: profileId });

    return NextResponse.json({
      success: true,
      alreadyRecommended: false,
      message: "Thank you for your recommendation!",
    });
  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
