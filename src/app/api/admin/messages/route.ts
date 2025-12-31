import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { z } from "zod";

const adminMessageSchema = z.object({
  profileId: z.string().uuid(),
  message: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profileId, message } = adminMessageSchema.parse(body);

    const supabase = await createClient();

    // Verify the profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", profileId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Create the admin message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: messageError } = await (supabase as any)
      .from("messages")
      .insert({
        profile_id: profileId,
        sender_name: "Verified.Doctor Team",
        sender_phone: "admin",
        message_content: message,
        is_read: false,
        is_admin_message: true,
        is_pinned: true,
        admin_sender_name: "Verified.Doctor Team",
      });

    if (messageError) {
      console.error("Error creating admin message:", messageError);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Admin message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
