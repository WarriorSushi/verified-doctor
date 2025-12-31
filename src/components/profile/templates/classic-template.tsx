"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  GraduationCap,
  Clock,
  Globe,
  Sparkles,
  ThumbsUp,
  Users,
  Calendar,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileActions } from "../profile-actions";
import { RecommendButton } from "../recommend-button";
import { ProfileViewTracker } from "../profile-view-tracker";
import { formatRecommendationCount, formatConnectionCount } from "@/lib/format-metrics";

interface Profile {
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
}

interface ConnectedDoctor {
  id: string;
  full_name: string;
  specialty: string | null;
  handle: string;
  profile_photo_url: string | null;
}

interface ClassicTemplateProps {
  profile: Profile;
  connectedDoctors: ConnectedDoctor[];
}

export function ClassicTemplate({ profile, connectedDoctors }: ClassicTemplateProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const recommendationText = formatRecommendationCount(profile.recommendation_count || 0);
  const connectionText = formatConnectionCount(profile.connection_count || 0);
  const services = profile.services?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const firstName = profile.full_name.split(" ")[0];

  // Truncate bio to ~150 chars
  const bioTruncated = profile.bio && profile.bio.length > 150
    ? profile.bio.slice(0, 150).trim() + "..."
    : profile.bio;
  const showBioToggle = profile.bio && profile.bio.length > 150;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Analytics: Track profile view */}
      <ProfileViewTracker profileId={profile.id} />

      {/* Subtle gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0099F7]/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#A4FDFF]/[0.05] rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 px-4 sm:px-6 py-3 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:scale-105">
              <Image
                src="/verified-doctor-logo.svg"
                alt="Verified.Doctor"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm sm:text-base font-semibold text-slate-800">
              verified<span className="text-[#0099F7]">.doctor</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-[#0099F7] hover:text-[#0080CC] transition-colors"
          >
            Claim yours →
          </Link>
        </div>
      </nav>

      {/* Profile Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-28 sm:pb-32">
        {/* Hero Section - Compact Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          {/* Mobile: Centered | Desktop: Side by side */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="flex justify-center sm:justify-start">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0099F7] to-[#0080CC] rounded-full blur-lg opacity-20" />
                {profile.profile_photo_url ? (
                  <Image
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    fill
                    className="object-cover rounded-full border-3 border-white shadow-lg relative z-10"
                  />
                ) : (
                  <div className="relative z-10 w-full h-full rounded-full bg-gradient-to-br from-[#0099F7] to-[#0080CC] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-3 border-white shadow-lg">
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {/* Name + Badge */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {profile.full_name}
                </h1>
                {profile.is_verified && (
                  <div className="relative w-5 h-5 sm:w-6 sm:h-6" title="Verified Doctor">
                    <Image
                      src="/verified-doctor-logo.svg"
                      alt="Verified"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Specialty */}
              <p className="text-[#0099F7] font-medium text-sm sm:text-base mb-2">{profile.specialty}</p>

              {/* Quick Stats - Inline */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-600">
                {profile.clinic_location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.clinic_location}
                  </span>
                )}
                {profile.years_experience && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {profile.years_experience}+ yrs
                  </span>
                )}
                {profile.consultation_fee && (
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    {profile.consultation_fee}
                  </span>
                )}
              </div>

              {/* Metrics - Compact */}
              {(recommendationText || connectionText) && (
                <div className="flex justify-center sm:justify-start gap-4 mt-3">
                  {recommendationText && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0099F7]/10 rounded-full">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#0099F7]" />
                      <span className="text-xs font-semibold text-[#0099F7]">
                        {profile.recommendation_count} {profile.recommendation_count === 1 ? "rec" : "recs"}
                      </span>
                    </div>
                  )}
                  {connectionText && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full">
                      <Users className="w-3.5 h-3.5 text-slate-600" />
                      <span className="text-xs font-semibold text-slate-600">
                        {profile.connection_count} connected
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Qualifications Badge */}
        {profile.qualifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex justify-center sm:justify-start mb-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs sm:text-sm text-slate-700">
              <GraduationCap className="w-3.5 h-3.5" />
              {profile.qualifications}
            </span>
          </motion.div>
        )}

        {/* Bio - Collapsible */}
        {profile.bio && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-6"
          >
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {showFullBio ? profile.bio : bioTruncated}
            </p>
            {showBioToggle && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="mt-1 text-[#0099F7] text-sm font-medium inline-flex items-center gap-1 hover:text-[#0080CC]"
              >
                {showFullBio ? (
                  <>Show less <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Read more <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            )}
          </motion.div>
        )}

        {/* Book Appointment - Prominent */}
        {profile.external_booking_url && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6"
          >
            <Button
              className="w-full bg-[#0099F7] hover:bg-[#0080CC] text-white h-11 sm:h-12 rounded-xl font-medium shadow-lg shadow-[#0099F7]/20"
              asChild
            >
              <a
                href={profile.external_booking_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
                <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
              </a>
            </Button>
          </motion.div>
        )}

        {/* Details Grid - 2 columns on tablet+ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            {(profile.clinic_name || profile.clinic_location) && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0099F7]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#0099F7]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide">Location</p>
                  <p className="text-sm text-slate-800 font-medium truncate">
                    {[profile.clinic_name, profile.clinic_location].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Languages */}
            {profile.languages && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0099F7]/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-[#0099F7]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide">Languages</p>
                  <p className="text-sm text-slate-800 font-medium">{profile.languages}</p>
                </div>
              </div>
            )}

            {/* Consultation Fee */}
            {profile.consultation_fee && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0099F7]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#0099F7]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide">Consultation</p>
                  <p className="text-sm text-slate-800 font-medium">{profile.consultation_fee}</p>
                </div>
              </div>
            )}

            {/* Registration */}
            {profile.registration_number && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0099F7]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#0099F7]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide">Registration</p>
                  <p className="text-sm text-slate-800 font-medium">{profile.registration_number}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Services - Horizontal scroll on mobile */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-5"
          >
            <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Services</p>
            <div className="flex flex-wrap gap-2">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs sm:text-sm text-slate-700 font-medium shadow-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Connected Doctors */}
        {connectedDoctors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mb-5"
          >
            <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              Professional Network
            </p>
            <div className="flex -space-x-2">
              {connectedDoctors.slice(0, 6).map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/${doctor.handle}`}
                  className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm hover:z-10 hover:scale-110 transition-transform"
                  title={doctor.full_name}
                >
                  {doctor.profile_photo_url ? (
                    <Image
                      src={doctor.profile_photo_url}
                      alt={doctor.full_name}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold">
                      {doctor.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                </Link>
              ))}
              {connectedDoctors.length > 6 && (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-xs font-medium text-slate-600">
                  +{connectedDoctors.length - 6}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Recommendation Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-gradient-to-br from-[#0099F7]/5 to-[#A4FDFF]/10 rounded-xl p-4 sm:p-5 text-center border border-[#0099F7]/10"
        >
          <p className="text-slate-600 text-sm mb-3">
            Had a great experience with {firstName}?
          </p>
          <RecommendButton profileId={profile.id} />
        </motion.div>
      </main>

      {/* Sticky Action Buttons */}
      <ProfileActions profile={profile} />
    </div>
  );
}
