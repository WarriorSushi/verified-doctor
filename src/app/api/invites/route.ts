import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";
import { randomBytes } from "crypto";
import { sendInviteEmail } from "@/lib/email/send";

const createInviteSchema = z.object({
  email: z.string().email().optional(),
});

// POST - Create a new invite
export async function POST(request: Request) {
  try {
    const { userId } = await getAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = createInviteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.issues },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the inviter's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, handle")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Generate unique invite code
    const inviteCode = randomBytes(6).toString("hex");

    // Create the invite
    const { data: invite, error: inviteError } = await supabase
      .from("invites")
      .insert({
        inviter_profile_id: profile.id,
        invite_code: inviteCode,
        invitee_email: result.data.email || null,
      })
      .select()
      .single();

    if (inviteError) {
      console.error("Invite creation error:", inviteError);
      return NextResponse.json(
        { error: "Failed to create invite" },
        { status: 500 }
      );
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://verified.doctor"}/sign-up?invite=${inviteCode}`;

    // Send invite email if email was provided
    if (result.data.email) {
      const emailResult = await sendInviteEmail(
        result.data.email,
        profile.full_name,
        profile.handle,
        inviteUrl
      );

      if (!emailResult.success) {
        console.warn("Failed to send invite email:", emailResult.error);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({
      invite,
      inviteUrl,
      inviter: {
        name: profile.full_name,
        handle: profile.handle,
      },
      emailSent: !!result.data.email,
    });
  } catch (error) {
    console.error("Create invite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - List all invites for the current user
export async function GET() {
  try {
    const { userId } = await getAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get the user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get all invites
    const { data: invites, error } = await supabase
      .from("invites")
      .select(`
        *,
        used_by:profiles!invites_used_by_profile_id_fkey(
          id, full_name, handle, specialty
        )
      `)
      .eq("inviter_profile_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get invites error:", error);
      return NextResponse.json(
        { error: "Failed to fetch invites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ invites });
  } catch (error) {
    console.error("Get invites error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
