import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";
import { MessageList } from "@/components/dashboard/message-list";

export default async function MessagesPage() {
  const { userId } = await getAuth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createClient();

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-1">
          Patient inquiries sent through your profile
        </p>
      </div>

      <MessageList messages={messages || []} profileId={profile.id} />
    </div>
  );
}
