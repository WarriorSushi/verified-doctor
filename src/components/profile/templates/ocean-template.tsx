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
  Waves,
  ChevronDown,
  ChevronUp,
  Handshake,
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

interface InvitedBy {
  id: string;
  full_name: string;
  specialty: string | null;
  handle: string;
}

interface OceanTemplateProps {
  profile: Profile;
  connectedDoctors: ConnectedDoctor[];
  invitedBy?: InvitedBy | null;
}

// Ocean theme colors
const theme = {
  primary: "#0077B6",
  primaryLight: "#00B4D8",
  primaryDark: "#023E8A",
  accent: "#90E0EF",
  accentLight: "#CAF0F8",
  bg: "#F8FCFE",
  bgCard: "#FFFFFF",
  text: "#1B4965",
  textMuted: "#5E8AA8",
  textLight: "#8DB4CE",
  border: "#D4E8F2",
};

export function OceanTemplate({ profile, connectedDoctors, invitedBy }: OceanTemplateProps) {
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
    <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>
      {/* Analytics: Track profile view */}
      <ProfileViewTracker profileId={profile.id} />

      {/* Ocean wave gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/4 w-full h-full rounded-full blur-3xl opacity-30"
          style={{ background: `radial-gradient(circle, ${theme.accentLight} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${theme.accent} 0%, transparent 70%)` }}
        />
      </div>

      {/* Navbar */}
      <nav
        className="relative z-20 px-4 sm:px-6 py-3 border-b backdrop-blur-sm"
        style={{ borderColor: theme.border, backgroundColor: `${theme.bgCard}E6` }}
      >
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
            <span className="text-sm sm:text-base font-semibold" style={{ color: theme.text }}>
              verified<span style={{ color: theme.primary }}>.doctor</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs sm:text-sm font-medium transition-colors flex items-center gap-1"
            style={{ color: theme.primary }}
          >
            <Waves className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Claim yours
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
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{ background: `linear-gradient(135deg, ${theme.primaryLight}, ${theme.accent})` }}
                />
                {profile.profile_photo_url ? (
                  <Image
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    fill
                    className="object-cover rounded-full border-3 shadow-lg relative z-10"
                    style={{ borderColor: theme.bgCard }}
                  />
                ) : (
                  <div
                    className="relative z-10 w-full h-full rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold border-3 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                      borderColor: theme.bgCard
                    }}
                  >
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
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: theme.text }}>
                  {profile.full_name}
                </h1>
                {profile.is_verified && (
                  <div className="relative w-6 h-6 sm:w-8 sm:h-8" title="Verified Doctor">
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
              <p className="font-medium text-sm sm:text-base mb-2" style={{ color: theme.primary }}>
                {profile.specialty}
              </p>

              {/* Quick Stats - Inline */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm" style={{ color: theme.textMuted }}>
                {profile.clinic_location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" style={{ color: theme.textLight }} />
                    {profile.clinic_location}
                  </span>
                )}
                {profile.years_experience && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" style={{ color: theme.textLight }} />
                    {profile.years_experience}+ yrs
                  </span>
                )}
                {profile.consultation_fee && (
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" style={{ color: theme.textLight }} />
                    {profile.consultation_fee}
                  </span>
                )}
              </div>

              {/* Metrics - Compact */}
              {(recommendationText || connectionText) && (
                <div className="flex justify-center sm:justify-start gap-4 mt-3">
                  {recommendationText && (
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: `${theme.primary}15` }}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                      <span className="text-xs font-semibold" style={{ color: theme.primary }}>
                        {profile.recommendation_count} {profile.recommendation_count === 1 ? "rec" : "recs"}
                      </span>
                    </div>
                  )}
                  {connectionText && (
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: theme.accentLight }}
                    >
                      <Users className="w-3.5 h-3.5" style={{ color: theme.text }} />
                      <span className="text-xs font-semibold" style={{ color: theme.text }}>
                        {profile.connection_count} connected
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Invited By Badge */}
        {invitedBy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="flex justify-center sm:justify-start mb-3"
          >
            <Link
              href={`/${invitedBy.handle}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-colors"
              style={{
                backgroundColor: `${theme.primary}15`,
                border: `1px solid ${theme.primary}30`,
                color: theme.primary
              }}
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>
                Invited by <span className="font-medium">{invitedBy.full_name}</span>
                {invitedBy.specialty && <span style={{ color: `${theme.primary}90` }}> ({invitedBy.specialty})</span>}
              </span>
            </Link>
          </motion.div>
        )}

        {/* Qualifications Badge */}
        {profile.qualifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex justify-center sm:justify-start mb-4"
          >
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm"
              style={{ backgroundColor: theme.accentLight, color: theme.primaryDark }}
            >
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
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: theme.textMuted }}>
              {showFullBio ? profile.bio : bioTruncated}
            </p>
            {showBioToggle && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="mt-1 text-sm font-medium inline-flex items-center gap-1"
                style={{ color: theme.primary }}
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
              className="w-full h-11 sm:h-12 rounded-xl font-medium text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                boxShadow: `0 8px 24px ${theme.primary}30`
              }}
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
          className="rounded-xl shadow-sm p-4 sm:p-5 mb-5"
          style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            {(profile.clinic_name || profile.clinic_location) && (
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textLight }}>
                    Location
                  </p>
                  <p className="text-sm font-medium truncate" style={{ color: theme.text }}>
                    {[profile.clinic_name, profile.clinic_location].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Languages */}
            {profile.languages && (
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <Globe className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textLight }}>
                    Languages
                  </p>
                  <p className="text-sm font-medium" style={{ color: theme.text }}>{profile.languages}</p>
                </div>
              </div>
            )}

            {/* Consultation Fee */}
            {profile.consultation_fee && (
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textLight }}>
                    Consultation
                  </p>
                  <p className="text-sm font-medium" style={{ color: theme.text }}>{profile.consultation_fee}</p>
                </div>
              </div>
            )}

            {/* Registration */}
            {profile.registration_number && (
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide" style={{ color: theme.textLight }}>
                    Registration
                  </p>
                  <p className="text-sm font-medium" style={{ color: theme.text }}>{profile.registration_number}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recommendation Section - Prominent placement */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl p-5 sm:p-6 text-center mb-6 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${theme.accentLight}, ${theme.accent}60)`,
            border: `1px solid ${theme.accent}`
          }}
        >
          {/* Animated pulse background */}
          <motion.div
            className="absolute inset-0"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}30, transparent)` }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="relative z-10">
            <p className="text-base sm:text-lg font-medium mb-4" style={{ color: theme.text }}>
              Had a great experience with {firstName}?
            </p>
            <RecommendButton profileId={profile.id} />
          </div>
        </motion.div>

        {/* Services */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mb-6"
          >
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-3" style={{ color: theme.textLight }}>
              Services
            </p>
            <div className="flex flex-wrap gap-2">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-sm"
                  style={{
                    backgroundColor: theme.bgCard,
                    border: `1px solid ${theme.border}`,
                    color: theme.text
                  }}
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
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6"
          >
            <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide mb-3" style={{ color: theme.textLight }}>
              Professional Network
            </p>
            <div className="flex -space-x-2">
              {connectedDoctors.slice(0, 6).map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/${doctor.handle}`}
                  className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 shadow-sm hover:z-10 hover:scale-110 transition-transform"
                  style={{ borderColor: theme.bgCard }}
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
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: `linear-gradient(135deg, ${theme.primaryLight}, ${theme.primary})` }}
                    >
                      {doctor.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                </Link>
              ))}
              {connectedDoctors.length > 6 && (
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 shadow-sm flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: theme.accentLight, borderColor: theme.bgCard, color: theme.primary }}
                >
                  +{connectedDoctors.length - 6}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* Sticky Action Buttons */}
      <ProfileActions profile={profile} />
    </div>
  );
}
