import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";
import { ConnectionsList } from "@/components/dashboard/connections-list";
import { NetworkStats } from "@/components/dashboard/network-stats";
import { InvitePanel } from "@/components/dashboard/invite-panel";

export default async function ConnectionsPage() {
  const { userId } = await getAuth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createClient();

  // Get the user's profile with connection count
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, connection_count")
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

  // Get invites sent by this user
  const { count: invitesSent } = await supabase
    .from("invites")
    .select("*", { count: "exact", head: true })
    .eq("inviter_profile_id", profile.id);

  // Get invites that were accepted (used)
  const { count: invitesAccepted } = await supabase
    .from("invites")
    .select("*", { count: "exact", head: true })
    .eq("inviter_profile_id", profile.id)
    .eq("used", true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Connections</h1>
        <p className="text-slate-600 mt-1">
          Build your professional network with verified physicians
        </p>
      </div>

      {/* Network Stats */}
      <NetworkStats
        connectionCount={profile.connection_count || transformedConnections.length}
        pendingRequestsCount={pendingRequests?.length || 0}
        invitesSent={invitesSent || 0}
        invitesAccepted={invitesAccepted || 0}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Connections List - Takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <ConnectionsList
            connections={transformedConnections}
            pendingRequests={pendingRequests || []}
          />
        </div>

        {/* Invite Panel - Takes 1/3 of the space */}
        <div className="lg:col-span-1">
          <InvitePanel
            doctorName={profile.full_name}
            currentConnectionCount={profile.connection_count || transformedConnections.length}
          />
        </div>
      </div>
    </div>
  );
}
