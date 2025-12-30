import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Briefcase, Calendar, ExternalLink, ThumbsUp, Users, Download, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatRecommendationCount, formatConnectionCount } from "@/lib/format-metrics";
import { Button } from "@/components/ui/button";
import { ProfileActions } from "@/components/profile/profile-actions";
import { RecommendButton } from "@/components/profile/recommend-button";

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

  // Increment view count (fire and forget)
  supabase.rpc("increment_view_count", { profile_uuid: profile.id });

  const recommendationText = formatRecommendationCount(profile.recommendation_count || 0);
  const connectionText = formatConnectionCount(profile.connection_count || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0099F7]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#A4FDFF]/20 rounded-full blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-20 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
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

          <Button variant="outline" size="sm" asChild>
            <Link href="/">Claim Yours</Link>
          </Button>
        </div>
      </nav>

      {/* Profile Content */}
      <main className="relative z-10 max-w-lg mx-auto px-6 pb-32">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mt-4">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-4">
              {profile.profile_photo_url ? (
                <Image
                  src={profile.profile_photo_url}
                  alt={profile.full_name}
                  fill
                  className="object-cover rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#0099F7] to-[#0080CC] flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                  {profile.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              )}
            </div>

            {/* Name + Badge */}
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.full_name}
              </h1>
              {profile.is_verified && (
                <div className="relative w-6 h-6">
                  <Image
                    src="/verified-doctor-logo.svg"
                    alt="Verified"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Specialty + Experience */}
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Briefcase className="w-4 h-4" />
              <span>{profile.specialty}</span>
              {profile.years_experience && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>{profile.years_experience} years</span>
                </>
              )}
            </div>

            {/* Location */}
            {(profile.clinic_name || profile.clinic_location) && (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span>
                  {[profile.clinic_name, profile.clinic_location]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>

          {/* Metrics */}
          {(recommendationText || connectionText) && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {recommendationText && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{recommendationText}</span>
                </div>
              )}
              {connectionText && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{connectionText}</span>
                </div>
              )}
            </div>
          )}

          {/* External Booking Link */}
          {profile.external_booking_url && (
            <div className="mt-6">
              <Button className="w-full" variant="outline" asChild>
                <a
                  href={profile.external_booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Recommendation Section */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 mt-4 text-center">
          <p className="text-slate-600 mb-4">
            Did you visit {profile.full_name.split(" ")[0]}?
          </p>
          <RecommendButton profileId={profile.id} />
        </div>
      </main>

      {/* Sticky Action Buttons */}
      <ProfileActions profile={profile} />
    </div>
  );
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { handle } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, specialty, clinic_location")
    .eq("handle", handle.toLowerCase())
    .single();

  if (!profile) {
    return {
      title: "Profile Not Found | Verified.Doctor",
    };
  }

  return {
    title: `${profile.full_name} | Verified.Doctor`,
    description: `${profile.specialty}${profile.clinic_location ? ` at ${profile.clinic_location}` : ""}`,
  };
}
