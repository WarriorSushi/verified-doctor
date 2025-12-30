import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ code: string }>;
}

// GET - Validate an invite code
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { code } = await params;
    const supabase = await createClient();

    // Find the invite
    const { data: invite, error } = await supabase
      .from("invites")
      .select(`
        *,
        inviter:profiles!invites_inviter_profile_id_fkey(
          id, full_name, handle, specialty, profile_photo_url
        )
      `)
      .eq("invite_code", code)
      .single();

    if (error || !invite) {
      return NextResponse.json(
        { error: "Invalid invite code", valid: false },
        { status: 404 }
      );
    }

    if (invite.used) {
      return NextResponse.json(
        { error: "This invite has already been used", valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      invite: {
        code: invite.invite_code,
        inviter: invite.inviter,
      },
    });
  } catch (error) {
    console.error("Validate invite error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
