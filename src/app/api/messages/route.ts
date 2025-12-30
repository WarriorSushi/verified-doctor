import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/test-auth";

const createMessageSchema = z.object({
  profileId: z.string().uuid("Invalid profile ID"),
  senderName: z.string().min(2, "Name is required").max(100),
  senderPhone: z.string().min(10, "Valid phone number required").max(20),
  messageContent: z.string().min(10, "Message too short").max(500, "Message too long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.errors[0]?.message || "Invalid data",
        },
        { status: 400 }
      );
    }

    const { profileId, senderName, senderPhone, messageContent } = result.data;

    const supabase = await createClient();

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", profileId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Create message
    const { data: message, error: insertError } = await supabase
      .from("messages")
      .insert({
        profile_id: profileId,
        sender_name: senderName,
        sender_phone: senderPhone,
        message_content: messageContent,
        is_read: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      messageId: message.id,
    });
  } catch (error) {
    console.error("Message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get messages for authenticated doctor
export async function GET() {
  try {
    const { userId } = await getAuth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get profile for this user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get messages
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
