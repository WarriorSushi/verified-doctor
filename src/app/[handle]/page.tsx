import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  ClassicTemplate,
  OceanTemplate,
  SageTemplate,
  WarmTemplate,
} from "@/components/profile/templates";
import { PauseCircle } from "lucide-react";

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
  is_frozen: boolean | null;
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

  // If profile is frozen, show unavailable page
  if (extendedProfile.is_frozen) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/verified-doctor-logo.svg"
                  alt="Verified.Doctor"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-slate-800 tracking-tight">
                verified<span className="text-[#0099F7]">.doctor</span>
              </span>
            </Link>
          </div>
        </header>

        {/* Frozen Profile Message */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <PauseCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Profile Unavailable
            </h1>
            <p className="text-slate-600 mb-6">
              This doctor&apos;s profile is currently offline. They may have temporarily paused their listing.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#0099F7] text-white font-medium hover:bg-[#0080CC] transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
