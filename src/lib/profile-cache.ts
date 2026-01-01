import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";

// React cache ensures this only runs once per request
// Even if called from layout AND page, it's deduplicated
export const getProfile = cache(async () => {
  const { userId } = await getAuth();

  if (!userId) {
    return { profile: null, userId: null };
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { profile, userId };
});

// Cached profile ID fetch - lightweight version
export const getProfileId = cache(async () => {
  const { userId } = await getAuth();

  if (!userId) {
    return { profileId: null, userId: null };
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  return { profileId: profile?.id || null, userId };
});
