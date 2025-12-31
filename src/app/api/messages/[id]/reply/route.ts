import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";

const replySchema = z.object({
  replyContent: z.string().min(1).max(500),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await getAuth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const result = replySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Reply content is required" },
        { status: 400 }
      );
    }

    const { replyContent } = result.data;
    const supabase = await createClient();

    // Verify ownership and get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("user_id", userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get the message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .eq("profile_id", profile.id)
      .single();

    if (messageError || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Check if already replied
    if (message.reply_sent_at) {
      return NextResponse.json(
        { error: "Already replied to this message" },
        { status: 400 }
      );
    }

    // In production, send SMS via MSG91
    // For now, we just update the database
    // const smsMessage = `Dr. ${profile.full_name} replied: ${replyContent}`;
    // await sendSMS(message.sender_phone, smsMessage);

    // Update message with reply
    const { error: updateError } = await supabase
      .from("messages")
      .update({
        reply_content: replyContent,
        reply_sent_at: new Date().toISOString(),
        is_read: true,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to save reply" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (error) {
    console.error("Reply error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
