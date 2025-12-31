import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";
import { z } from "zod";

const queueEmailSchema = z.object({
  profileId: z.string().uuid(),
  templateSlug: z.string(),
  scheduledFor: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// GET - List queued emails (admin can see all, user sees their own)
export async function GET(request: Request) {
  try {
    const { userId } = await getAuth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending, sent, cancelled, failed
    const profileId = searchParams.get("profileId");

    const supabase = await createClient();

    // Get user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from("automation_email_queue")
      .select(`
        *,
        profile:profiles(id, full_name, handle)
      `)
      .order("scheduled_for", { ascending: true });

    // If profileId is specified, filter by it (admin use)
    if (profileId) {
      query = query.eq("profile_id", profileId);
    } else if (profile) {
      // Otherwise, regular users only see their own
      query = query.eq("profile_id", profile.id);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data: queuedEmails, error } = await query;

    if (error) {
      console.error("Error fetching queue:", error);
      return NextResponse.json(
        { error: "Failed to fetch queue" },
        { status: 500 }
      );
    }

    return NextResponse.json({ queuedEmails });
  } catch (error) {
    console.error("Queue error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Queue a new email
export async function POST(request: Request) {
  try {
    const { userId } = await getAuth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profileId, templateSlug, scheduledFor, metadata } =
      queueEmailSchema.parse(body);

    const supabase = await createClient();

    // Verify template exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: template, error: templateError } = await (supabase as any)
      .from("automation_email_templates")
      .select("slug, is_active")
      .eq("slug", templateSlug)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    if (!template.is_active) {
      return NextResponse.json(
        { error: "Template is not active" },
        { status: 400 }
      );
    }

    // Queue the email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: queuedEmail, error: queueError } = await (supabase as any)
      .from("automation_email_queue")
      .insert({
        profile_id: profileId,
        template_slug: templateSlug,
        scheduled_for: scheduledFor || new Date().toISOString(),
        status: "pending",
        metadata,
      })
      .select()
      .single();

    if (queueError) {
      console.error("Error queuing email:", queueError);
      return NextResponse.json(
        { error: "Failed to queue email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      queuedEmail,
      message: "Email queued successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Queue error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
