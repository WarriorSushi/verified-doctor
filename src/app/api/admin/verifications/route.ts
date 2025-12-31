import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get all profiles with pending verification
    const { data: pendingProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, handle, full_name, specialty, clinic_name, verification_status, created_at")
      .eq("verification_status", "pending")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching pending profiles:", profilesError);
      return NextResponse.json(
        { error: "Failed to fetch verifications" },
        { status: 500 }
      );
    }

    // Get verification documents for each profile
    const profileIds = pendingProfiles?.map((p) => p.id) || [];

    const { data: documents, error: docsError } = await supabase
      .from("verification_documents")
      .select("*")
      .in("profile_id", profileIds);

    if (docsError) {
      console.error("Error fetching documents:", docsError);
    }

    // Combine profiles with their documents
    const verificationsWithDocs = pendingProfiles?.map((profile) => ({
      ...profile,
      documents: documents?.filter((doc) => doc.profile_id === profile.id) || [],
    }));

    return NextResponse.json({ verifications: verificationsWithDocs });
  } catch (error) {
    console.error("Admin verifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
