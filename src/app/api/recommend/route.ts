import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

const recommendSchema = z.object({
  profileId: z.string().uuid("Invalid profile ID"),
});

// Simple fingerprint based on request headers
function getFingerprint(headersList: Headers): string {
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const acceptEncoding = headersList.get("accept-encoding") || "";

  // Create a simple hash
  const data = `${userAgent}|${acceptLanguage}|${acceptEncoding}`;
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
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] ||
               headersList.get("x-real-ip") ||
               "unknown";
    const fingerprint = getFingerprint(headersList);

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
    const { data: existing } = await supabase
      .from("recommendations")
      .select("id")
      .eq("profile_id", profileId)
      .eq("fingerprint", fingerprint)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyRecommended: true,
        message: "You've already recommended this doctor",
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
