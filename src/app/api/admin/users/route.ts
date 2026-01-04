import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/admin-auth";

// Sanitize search input to prevent SQL injection
// Escapes special PostgreSQL LIKE/ILIKE characters
function sanitizeSearchInput(input: string): string {
  // Remove any characters that could be used for SQL injection
  // Allow only alphanumeric, spaces, and common name characters
  return input
    .replace(/[%_\\'";\-\-]/g, "") // Remove SQL special chars
    .replace(/[^\w\s.\-@]/g, "") // Allow only word chars, spaces, dots, hyphens, @
    .trim()
    .slice(0, 100); // Limit length
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();

    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const rawSearch = searchParams.get("search") || "";
    const search = sanitizeSearchInput(rawSearch);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20"), 1), 100); // Clamp between 1-100
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // Build the query
    let query = supabase
      .from("profiles")
      .select("id, full_name, handle, specialty, profile_photo_url, is_verified, verification_status, recommendation_count, connection_count, created_at", { count: "exact" });

    // Add search filter using proper Supabase filters to prevent SQL injection
    // Using multiple ilike filters with or() using array syntax
    if (search) {
      // Create search pattern with wildcards
      const searchPattern = `%${search}%`;
      // Use Supabase's filter builder with proper parameterization
      query = query.or(
        `full_name.ilike.${searchPattern},handle.ilike.${searchPattern},specialty.ilike.${searchPattern}`
      );
    }

    // Add pagination and ordering
    const { data: profiles, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    return NextResponse.json({
      users: profiles || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
