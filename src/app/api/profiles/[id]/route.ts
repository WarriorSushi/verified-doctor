import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";

const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  specialty: z.string().optional(),
  clinicName: z.string().nullable().optional(),
  clinicLocation: z.string().nullable().optional(),
  yearsExperience: z.number().min(0).max(70).nullable().optional(),
  profilePhotoUrl: z.string().url().nullable().optional(),
  externalBookingUrl: z.string().url().nullable().optional(),
  profileTemplate: z.enum(["classic", "ocean", "sage", "warm"]).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await getAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.issues },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify ownership
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build update object
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (result.data.fullName !== undefined) {
      updates.full_name = result.data.fullName;
    }
    if (result.data.specialty !== undefined) {
      updates.specialty = result.data.specialty;
    }
    if (result.data.clinicName !== undefined) {
      updates.clinic_name = result.data.clinicName;
    }
    if (result.data.clinicLocation !== undefined) {
      updates.clinic_location = result.data.clinicLocation;
    }
    if (result.data.yearsExperience !== undefined) {
      updates.years_experience = result.data.yearsExperience;
    }
    if (result.data.profilePhotoUrl !== undefined) {
      updates.profile_photo_url = result.data.profilePhotoUrl;
    }
    if (result.data.externalBookingUrl !== undefined) {
      updates.external_booking_url = result.data.externalBookingUrl;
    }
    if (result.data.profileTemplate !== undefined) {
      updates.profile_template = result.data.profileTemplate;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
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
