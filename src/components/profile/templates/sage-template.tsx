"use client";

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
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileActions } from "../profile-actions";
import { RecommendButton } from "../recommend-button";
import { formatRecommendationCount, formatConnectionCount } from "@/lib/format-metrics";

// Sage theme - calming green medical aesthetic
const theme = {
  primary: "#4A7C59",
  primaryLight: "#6B9B7A",
  primaryDark: "#2D5A3D",
  accent: "#A8D5BA",
  accentLight: "#D4EAD8",
  bg: "#F9FBF9",
  bgCard: "#FFFFFF",
  text: "#2D3B2D",
  textMuted: "#5C6B5C",
  textLight: "#8A9B8A",
  border: "#D4E5D7",
};

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

interface SageTemplateProps {
  profile: Profile;
  connectedDoctors: ConnectedDoctor[];
}

export function SageTemplate({ profile, connectedDoctors }: SageTemplateProps) {
  const recommendationText = formatRecommendationCount(profile.recommendation_count || 0);
  const connectionText = formatConnectionCount(profile.connection_count || 0);
  const services = profile.services?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const firstName = profile.full_name.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>
      {/* Organic gradient shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: theme.accentLight }}
        />
        <div
          className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: theme.accent }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full blur-3xl opacity-25"
          style={{ backgroundColor: theme.accentLight }}
        />
      </div>

      {/* Navbar */}
      <nav
        className="relative z-20 px-6 py-4 border-b backdrop-blur-sm"
        style={{
          backgroundColor: `${theme.bgCard}E6`,
          borderColor: theme.border
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-7 h-7 transition-transform group-hover:scale-105">
              <Image
                src="/verified-doctor-logo.svg"
                alt="Verified.Doctor"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-base font-semibold" style={{ color: theme.text }}>
              verified<span style={{ color: theme.primary }}>.doctor</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium transition-colors"
            style={{ color: theme.primary }}
          >
            Claim yours →
          </Link>
        </div>
      </nav>

      {/* Profile Content */}
      <main className="relative z-10 max-w-xl mx-auto px-6 pt-8 pb-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          {/* Avatar with organic border */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Decorative rings */}
            <div
              className="absolute inset-[-8px] rounded-full opacity-20"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
              }}
            />
            <div
              className="absolute inset-[-4px] rounded-full"
              style={{ backgroundColor: theme.bgCard }}
            />

            {profile.profile_photo_url ? (
              <Image
                src={profile.profile_photo_url}
                alt={profile.full_name}
                fill
                className="object-cover rounded-full relative z-10"
                style={{ border: `3px solid ${theme.bgCard}` }}
              />
            ) : (
              <div
                className="relative z-10 w-full h-full rounded-full flex items-center justify-center text-white text-3xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryLight})`,
                  border: `3px solid ${theme.bgCard}`
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

            {/* Leaf decoration */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center z-20"
              style={{ backgroundColor: theme.accentLight }}
            >
              <Leaf className="w-4 h-4" style={{ color: theme.primary }} />
            </motion.div>
          </div>

          {/* Name + Verified Badge */}
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: theme.text }}
            >
              {profile.full_name}
            </h1>
            {profile.is_verified && (
              <div className="relative w-6 h-6" title="Verified Doctor">
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
          <p
            className="font-medium mb-4"
            style={{ color: theme.primary }}
          >
            {profile.specialty}
          </p>

          {/* Quick Info Pills */}
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {profile.qualifications && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: theme.accentLight,
                  color: theme.primaryDark
                }}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                {profile.qualifications}
              </span>
            )}
            {profile.years_experience && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: theme.accentLight,
                  color: theme.primaryDark
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                {profile.years_experience}+ years
              </span>
            )}
          </div>
        </motion.div>

        {/* Bio */}
        {profile.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <p
              className="leading-relaxed text-center"
              style={{ color: theme.textMuted }}
            >
              {profile.bio}
            </p>
          </motion.div>
        )}

        {/* Metrics */}
        {(recommendationText || connectionText) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center gap-6 mb-10"
          >
            {recommendationText && (
              <div className="text-center">
                <div
                  className="flex items-center justify-center gap-1.5 mb-1"
                  style={{ color: theme.primary }}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xl font-bold">{profile.recommendation_count}</span>
                </div>
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{ color: theme.textLight }}
                >
                  Recommendations
                </p>
              </div>
            )}
            {connectionText && (
              <div className="text-center">
                <div
                  className="flex items-center justify-center gap-1.5 mb-1"
                  style={{ color: theme.text }}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-xl font-bold">{profile.connection_count}</span>
                </div>
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{ color: theme.textLight }}
                >
                  Connections
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl p-6 mb-6 shadow-sm"
          style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`
          }}
        >
          <div className="grid gap-5">
            {/* Location */}
            {(profile.clinic_name || profile.clinic_location) && (
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.accentLight }}
                >
                  <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wide mb-0.5"
                    style={{ color: theme.textLight }}
                  >
                    Location
                  </p>
                  <p className="font-medium" style={{ color: theme.text }}>
                    {[profile.clinic_name, profile.clinic_location].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Languages */}
            {profile.languages && (
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.accentLight }}
                >
                  <Globe className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wide mb-0.5"
                    style={{ color: theme.textLight }}
                  >
                    Languages
                  </p>
                  <p className="font-medium" style={{ color: theme.text }}>
                    {profile.languages}
                  </p>
                </div>
              </div>
            )}

            {/* Consultation Fee */}
            {profile.consultation_fee && (
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.accentLight }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wide mb-0.5"
                    style={{ color: theme.textLight }}
                  >
                    Consultation
                  </p>
                  <p className="font-medium" style={{ color: theme.text }}>
                    {profile.consultation_fee}
                  </p>
                </div>
              </div>
            )}

            {/* Registration */}
            {profile.registration_number && (
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: theme.accentLight }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wide mb-0.5"
                    style={{ color: theme.textLight }}
                  >
                    Registration
                  </p>
                  <p className="font-medium" style={{ color: theme.text }}>
                    {profile.registration_number}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Services */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-6"
          >
            <p
              className="text-xs font-medium uppercase tracking-wide mb-3 text-center"
              style={{ color: theme.textLight }}
            >
              Services
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all hover:scale-105"
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

        {/* Book Appointment */}
        {profile.external_booking_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <Button
              className="w-full h-12 rounded-xl font-medium text-white shadow-lg"
              style={{
                backgroundColor: theme.primary,
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

        {/* Connected Doctors */}
        {connectedDoctors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mb-6"
          >
            <p
              className="text-xs font-medium uppercase tracking-wide mb-3 text-center"
              style={{ color: theme.textLight }}
            >
              Professional Network
            </p>
            <div className="flex justify-center -space-x-3">
              {connectedDoctors.slice(0, 5).map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/${doctor.handle}`}
                  className="relative w-10 h-10 rounded-full border-2 shadow-sm hover:z-10 hover:scale-110 transition-transform"
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
                      style={{
                        background: `linear-gradient(135deg, ${theme.primaryLight}, ${theme.accent})`
                      }}
                    >
                      {doctor.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                </Link>
              ))}
              {connectedDoctors.length > 5 && (
                <div
                  className="w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: theme.accentLight,
                    borderColor: theme.bgCard,
                    color: theme.primary
                  }}
                >
                  +{connectedDoctors.length - 5}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Recommendation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl p-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${theme.accentLight}50, ${theme.accent}30)`,
            border: `1px solid ${theme.accent}50`
          }}
        >
          <p style={{ color: theme.textMuted }} className="mb-4">
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
