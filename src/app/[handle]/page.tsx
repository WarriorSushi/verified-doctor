import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ClassicTemplate,
  OceanTemplate,
  SageTemplate,
  WarmTemplate,
} from "@/components/profile/templates";

// Extended profile type including new fields from migration
interface ExtendedProfile {
  id: string;
  handle: string;
  full_name: string;
  specialty: string | null;
  bio: string | null;
  qualifications: string | null;
  years_experience: number | null;
  registration_number: string | null;
  clinic_name: string | null;
  clinic_location: string | null;
  languages: string | null;
  consultation_fee: string | null;
  services: string | null;
  profile_photo_url: string | null;
  external_booking_url: string | null;
  is_verified: boolean;
  recommendation_count: number;
  connection_count: number;
  profile_template: string | null;
}

interface ProfilePageProps {
  params: Promise<{ handle: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = await params;
  const supabase = await createClient();

  // Fetch profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", handle.toLowerCase())
    .single();

  if (error || !profile) {
    notFound();
  }

  // Cast to extended profile type (includes new migration fields)
  const extendedProfile = profile as unknown as ExtendedProfile;

  // Increment view count (fire and forget)
  supabase.rpc("increment_view_count", { profile_uuid: extendedProfile.id });

  // Fetch connected doctors
  const { data: connections } = await supabase
    .from("connections")
    .select(`
      requester_id,
      receiver_id,
      requester:profiles!connections_requester_id_fkey(
        id, full_name, specialty, handle, profile_photo_url
      ),
      receiver:profiles!connections_receiver_id_fkey(
        id, full_name, specialty, handle, profile_photo_url
      )
    `)
    .or(`requester_id.eq.${extendedProfile.id},receiver_id.eq.${extendedProfile.id}`)
    .eq("status", "accepted");

  // Extract connected doctors (exclude self)
  const connectedDoctors = (connections || []).map((conn) => {
    if (conn.requester_id === extendedProfile.id) {
      return conn.receiver;
    }
    return conn.requester;
  }).filter(Boolean) as Array<{
    id: string;
    full_name: string;
    specialty: string | null;
    handle: string;
    profile_photo_url: string | null;
  }>;

  // Route to the correct template
  const template = extendedProfile.profile_template || "classic";

  switch (template) {
    case "ocean":
      return <OceanTemplate profile={extendedProfile} connectedDoctors={connectedDoctors} />;
    case "sage":
      return <SageTemplate profile={extendedProfile} connectedDoctors={connectedDoctors} />;
    case "warm":
      return <WarmTemplate profile={extendedProfile} connectedDoctors={connectedDoctors} />;
    case "classic":
    default:
      return <ClassicTemplate profile={extendedProfile} connectedDoctors={connectedDoctors} />;
  }
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", handle.toLowerCase())
    .single();

  if (!profile) {
    return {
      title: "Profile Not Found | Verified.Doctor",
    };
  }

  // Cast to access new fields from migration
  const extProfile = profile as unknown as ExtendedProfile;

  const description = extProfile.bio
    ? extProfile.bio.slice(0, 160)
    : `${extProfile.specialty}${extProfile.clinic_location ? ` at ${extProfile.clinic_location}` : ""}`;

  return {
    title: `${extProfile.full_name} | Verified.Doctor`,
    description,
    openGraph: {
      title: `${extProfile.full_name} | Verified.Doctor`,
      description,
      type: "profile",
    },
  };
}
