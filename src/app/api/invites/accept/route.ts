import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";

const acceptInviteSchema = z.object({
  inviteCode: z.string().min(1),
});

// POST - Accept an invite for an existing user
export async function POST(request: Request) {
  try {
    const { userId } = await getAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = acceptInviteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.issues },
        { status: 400 }
      );
    }

    const { inviteCode } = result.data;
    const supabase = await createClient();

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, handle")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Find the invite
    const { data: invite, error: inviteError } = await supabase
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

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: "Invalid invite code" },
        { status: 404 }
      );
    }

    if (invite.used) {
      return NextResponse.json(
        { error: "This invite has already been used" },
        { status: 400 }
      );
    }

    // Check if they're already connected
    const { data: existingConnection } = await supabase
      .from("connections")
      .select("id")
      .or(`and(requester_id.eq.${invite.inviter_profile_id},receiver_id.eq.${profile.id}),and(requester_id.eq.${profile.id},receiver_id.eq.${invite.inviter_profile_id})`)
      .single();

    if (existingConnection) {
      return NextResponse.json(
        { error: "You are already connected with this doctor", alreadyConnected: true },
        { status: 400 }
      );
    }

    // Check if they're trying to connect with themselves
    if (invite.inviter_profile_id === profile.id) {
      return NextResponse.json(
        { error: "You cannot use your own invite" },
        { status: 400 }
      );
    }

    // Create connection between inviter and existing user
    const { error: connectionError } = await supabase
      .from("connections")
      .insert({
        requester_id: invite.inviter_profile_id,
        receiver_id: profile.id,
        status: "accepted",
      });

    if (connectionError) {
      console.error("Connection error:", connectionError);
      return NextResponse.json(
        { error: "Failed to create connection" },
        { status: 500 }
      );
    }

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

    return NextResponse.json({
      success: true,
      connectedWith: invite.inviter,
      message: `You are now connected with Dr. ${(invite.inviter as { full_name: string })?.full_name || "your colleague"}!`,
    });
  } catch (error) {
    console.error("Accept invite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
