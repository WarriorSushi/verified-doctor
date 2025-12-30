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
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileActions } from "../profile-actions";
import { RecommendButton } from "../recommend-button";
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

interface OceanTemplateProps {
  profile: Profile;
  connectedDoctors: ConnectedDoctor[];
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

export function OceanTemplate({ profile, connectedDoctors }: OceanTemplateProps) {
  const recommendationText = formatRecommendationCount(profile.recommendation_count || 0);
  const connectionText = formatConnectionCount(profile.connection_count || 0);
  const services = profile.services?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const firstName = profile.full_name.split(" ")[0];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bg }}
    >
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
        {/* Subtle wave pattern at bottom */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full opacity-5"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: "200px" }}
        >
          <path
            fill={theme.primary}
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Navbar */}
      <nav
        className="relative z-20 px-6 py-4 border-b backdrop-blur-sm"
        style={{ borderColor: theme.border, backgroundColor: `${theme.bgCard}E6` }}
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
            className="text-sm font-medium transition-colors flex items-center gap-1"
            style={{ color: theme.primary }}
          >
            <Waves className="w-4 h-4" />
            Claim yours
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
          {/* Avatar with ocean ring */}
          <div className="relative w-32 h-32 mx-auto mb-5">
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryLight}, ${theme.accent})`,
                padding: "4px",
              }}
            >
              <div className="w-full h-full rounded-full" style={{ backgroundColor: theme.bg }} />
            </div>
            <div className="absolute inset-1">
              {profile.profile_photo_url ? (
                <Image
                  src={profile.profile_photo_url}
                  alt={profile.full_name}
                  fill
                  className="object-cover rounded-full border-4 shadow-xl"
                  style={{ borderColor: theme.bgCard }}
                />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 shadow-xl"
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

          {/* Name + Verified Badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: theme.text }}>
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
          <p className="font-semibold mb-3" style={{ color: theme.primary }}>{profile.specialty}</p>

          {/* Quick Info Pills */}
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {profile.qualifications && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: theme.accentLight, color: theme.primaryDark }}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                {profile.qualifications}
              </span>
            )}
            {profile.years_experience && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: theme.accentLight, color: theme.primaryDark }}
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
            <p className="leading-relaxed text-center" style={{ color: theme.textMuted }}>
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
            className="flex justify-center gap-8 mb-10"
          >
            {recommendationText && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1" style={{ color: theme.primary }}>
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">{profile.recommendation_count}</span>
                </div>
                <p className="text-xs uppercase tracking-wider font-medium" style={{ color: theme.textLight }}>
                  Recommendations
                </p>
              </div>
            )}
            {connectionText && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1" style={{ color: theme.text }}>
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold">{profile.connection_count}</span>
                </div>
                <p className="text-xs uppercase tracking-wider font-medium" style={{ color: theme.textLight }}>
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
          className="rounded-2xl shadow-lg p-6 mb-6"
          style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
        >
          <div className="grid gap-5">
            {(profile.clinic_name || profile.clinic_location) && (
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <MapPin className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: theme.textLight }}>
                    Location
                  </p>
                  <p className="font-medium" style={{ color: theme.text }}>
                    {[profile.clinic_name, profile.clinic_location].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            )}

            {profile.languages && (
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <Globe className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: theme.textLight }}>
                    Languages
                  </p>
                  <p className="font-medium" style={{ color: theme.text }}>{profile.languages}</p>
                </div>
              </div>
            )}

            {profile.consultation_fee && (
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: theme.textLight }}>
                    Consultation
                  </p>
                  <p className="font-medium" style={{ color: theme.text }}>{profile.consultation_fee}</p>
                </div>
              </div>
            )}

            {profile.registration_number && (
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${theme.primary}15` }}
                >
                  <CheckCircle2 className="w-5 h-5" style={{ color: theme.primary }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: theme.textLight }}>
                    Registration
                  </p>
                  <p className="font-medium" style={{ color: theme.text }}>{profile.registration_number}</p>
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
            <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-center" style={{ color: theme.textLight }}>
              Services Offered
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    backgroundColor: theme.bgCard,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
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
              className="w-full h-12 rounded-xl font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
                boxShadow: `0 10px 30px -10px ${theme.primary}60`,
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
                <ExternalLink className="w-4 h-4 ml-2 opacity-60" />
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
            <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-center" style={{ color: theme.textLight }}>
              Professional Network
            </p>
            <div className="flex justify-center -space-x-3">
              {connectedDoctors.slice(0, 5).map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/${doctor.handle}`}
                  className="relative w-11 h-11 rounded-full border-3 shadow-md hover:z-10 hover:scale-110 transition-transform"
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
                      className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${theme.primaryLight}, ${theme.primary})` }}
                    >
                      {doctor.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                </Link>
              ))}
              {connectedDoctors.length > 5 && (
                <div
                  className="w-11 h-11 rounded-full border-3 shadow-md flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: theme.accentLight, borderColor: theme.bgCard, color: theme.primary }}
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
            background: `linear-gradient(135deg, ${theme.accentLight}, ${theme.accent}40)`,
            border: `1px solid ${theme.accent}60`,
          }}
        >
          <p className="mb-4" style={{ color: theme.text }}>
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
