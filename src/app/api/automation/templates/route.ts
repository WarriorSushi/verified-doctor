import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";

// GET - List all email templates (admin only for now)
export async function GET() {
  try {
    const { userId } = await getAuth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: templates, error } = await (supabase as any)
      .from("automation_email_templates")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching templates:", error);
      return NextResponse.json(
        { error: "Failed to fetch templates" },
        { status: 500 }
      );
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Templates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
