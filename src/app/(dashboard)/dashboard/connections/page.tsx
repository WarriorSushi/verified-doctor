import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";
import { ConnectionsList } from "@/components/dashboard/connections-list";

export default async function ConnectionsPage() {
  const { userId } = await getAuth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createClient();

  // Get the user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  // Get all accepted connections
  const { data: connections } = await supabase
    .from("connections")
    .select(`
      id,
      status,
      created_at,
      requester:profiles!connections_requester_id_fkey(
        id, full_name, handle, specialty, profile_photo_url, is_verified
      ),
      receiver:profiles!connections_receiver_id_fkey(
        id, full_name, handle, specialty, profile_photo_url, is_verified
      )
    `)
    .or(`requester_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  // Transform to show the "other" person
  const transformedConnections = connections?.map((conn) => {
    const isRequester = conn.requester?.id === profile.id;
    return {
      id: conn.id,
      connectedAt: conn.created_at,
      profile: isRequester ? conn.receiver : conn.requester,
    };
  }) || [];

  // Get pending requests received
  const { data: pendingRequests } = await supabase
    .from("connections")
    .select(`
      id,
      created_at,
      requester:profiles!connections_requester_id_fkey(
        id, full_name, handle, specialty, profile_photo_url, is_verified
      )
    `)
    .eq("receiver_id", profile.id)
    .eq("status", "pending");

  return (
    <ConnectionsList
      connections={transformedConnections}
      pendingRequests={pendingRequests || []}
    />
  );
}
