import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/test-auth";
import { isBannedHandle } from "@/lib/banned-handles";

const createProfileSchema = z.object({
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
  fullName: z.string().min(2, "Full name is required").max(100),
  specialty: z.string().min(2, "Specialty is required"),
  clinicName: z.string().optional(),
  clinicLocation: z.string().optional(),
  yearsExperience: z.number().min(0).max(70).optional(),
  profilePhotoUrl: z.string().url().optional().or(z.literal("")),
  externalBookingUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const { userId } = await getAuth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.errors[0]?.message || "Invalid data",
        },
        { status: 400 }
      );
    }

    const {
      handle,
      fullName,
      specialty,
      clinicName,
      clinicLocation,
      yearsExperience,
      profilePhotoUrl,
      externalBookingUrl,
    } = result.data;

    // Check if handle is banned
    if (isBannedHandle(handle)) {
      return NextResponse.json(
        { error: "This handle is not available" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if handle is already taken
    const { data: existingHandle } = await supabase
      .from("profiles")
      .select("handle")
      .eq("handle", handle)
      .single();

    if (existingHandle) {
      return NextResponse.json(
        { error: "This handle is already taken" },
        { status: 400 }
      );
    }

    // Check if user already has a profile
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "You already have a profile" },
        { status: 400 }
      );
    }

    // Create the profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        handle: handle.toLowerCase(),
        full_name: fullName,
        specialty,
        clinic_name: clinicName || null,
        clinic_location: clinicLocation || null,
        years_experience: yearsExperience || null,
        profile_photo_url: profilePhotoUrl || null,
        external_booking_url: externalBookingUrl || null,
        is_verified: false,
        verification_status: "none",
        recommendation_count: 0,
        connection_count: 0,
        view_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
      message: `Your profile is live at verified.doctor/${handle}`,
    });
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await getAuth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
