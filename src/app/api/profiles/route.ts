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
  inviteCode: z.string().optional(),
  // New enhanced fields
  bio: z.string().max(500).optional(),
  qualifications: z.string().max(200).optional(),
  languages: z.string().max(200).optional(),
  registrationNumber: z.string().max(100).optional(),
  consultationFee: z.string().max(50).optional(),
  services: z.string().max(500).optional(),
  profileTemplate: z.enum(["classic", "modern", "minimal", "professional"]).optional(),
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
          details: result.error.issues[0]?.message || "Invalid data",
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
      inviteCode,
      bio,
      qualifications,
      languages,
      registrationNumber,
      consultationFee,
      services,
      profileTemplate,
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
        bio: bio || null,
        qualifications: qualifications || null,
        languages: languages || null,
        registration_number: registrationNumber || null,
        consultation_fee: consultationFee || null,
        services: services || null,
        profile_template: profileTemplate || "classic",
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

    // Handle invite code - auto-connect with inviter
    let connectedWith = null;
    if (inviteCode) {
      // Find the invite
      const { data: invite } = await supabase
        .from("invites")
        .select(`
          id,
          inviter_profile_id,
          used,
          inviter:profiles!invites_inviter_profile_id_fkey(
            id, full_name, handle
          )
        `)
        .eq("invite_code", inviteCode)
        .single();

      if (invite && !invite.used) {
        // Create connection between inviter and new user
        const { error: connectionError } = await supabase
          .from("connections")
          .insert({
            requester_id: invite.inviter_profile_id,
            receiver_id: profile.id,
            status: "accepted",
          });

        if (!connectionError) {
          // Mark invite as used
          await supabase
            .from("invites")
            .update({
              used: true,
              used_by_profile_id: profile.id,
            })
            .eq("id", invite.id);

          // Increment connection counts for both
          await supabase.rpc("increment_connection_counts", {
            profile1_uuid: invite.inviter_profile_id,
            profile2_uuid: profile.id,
          });

          connectedWith = invite.inviter;
        }
      }
    }

    return NextResponse.json({
      success: true,
      profile,
      connectedWith,
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
