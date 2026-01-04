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
  Handshake,
  Heart,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileActions } from "../profile-actions";
import { RecommendButton } from "../recommend-button";
import { ProfileViewTracker } from "../profile-view-tracker";
import { formatRecommendationCount, formatConnectionCount } from "@/lib/format-metrics";
import {
  VideoIntroduction,
  EducationTimeline,
  HospitalAffiliations,
  ConditionsProcedures,
  ApproachToCare,
  CaseStudies,
  FirstVisitGuide,
  AvailabilityBadge,
  TelemedicineBadge,
  ProfessionalMemberships,
  MediaPublications,
  ClinicGallery,
} from "../sections";

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
  video_introduction_url: string | null;
  approach_to_care: string | null;
  first_visit_guide: string | null;
  availability_note: string | null;
  conditions_treated: string | null;
  procedures_performed: string | null;
  is_available: boolean | null;
  offers_telemedicine: boolean | null;
  education_timeline: unknown;
  hospital_affiliations: unknown;
  case_studies: unknown;
  clinic_gallery: unknown;
  professional_memberships: unknown;
  media_publications: unknown;
  section_visibility: unknown;
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

interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    backgroundAlt: string;
    primary: string;
    primaryHover: string;
    accent: string;
    text: string;
    textMuted: string;
    textOnPrimary: string;
    card: string;
    cardBorder: string;
    gradientFrom?: string;
    gradientTo?: string;
    isDark?: boolean;
  };
}

interface HeroTemplateProps {
  profile: Profile;
  connectedDoctors: ConnectedDoctor[];
  invitedBy?: InvitedBy | null;
  theme: ThemeConfig;
}

function isSectionVisible(visibility: unknown, key: string): boolean {
  if (!visibility || typeof visibility !== "object") return false;
  const v = visibility as Record<string, boolean>;
  return v[key] === true;
}

export function HeroTemplate({ profile, connectedDoctors, invitedBy, theme }: HeroTemplateProps) {
  const colors = theme.colors;
  const themeColors = { primary: colors.primary, accent: colors.accent };
  const [showFullBio, setShowFullBio] = useState(false);
  const recommendationText = formatRecommendationCount(profile.recommendation_count || 0);
  const connectionText = formatConnectionCount(profile.connection_count || 0);
  const services = profile.services?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const firstName = profile.full_name.split(" ")[0];
  const visibility = profile.section_visibility;

  const bioTruncated = profile.bio && profile.bio.length > 150
    ? profile.bio.slice(0, 150).trim() + "..."
    : profile.bio;
  const showBioToggle = profile.bio && profile.bio.length > 150;

  return (
    <div className="min-h-screen bg-white">
      <ProfileViewTracker profileId={profile.id} />

      {/* Hero Section with Large Photo Background */}
      <div className="relative">
        {/* Dramatic gradient background */}
        <div className="absolute inset-0 h-[50vh] sm:h-[55vh] bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-400 overflow-hidden">
          {/* Animated mesh pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="hero-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#hero-grid)" />
            </svg>
          </div>

          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 left-20 w-40 h-40 bg-cyan-300/20 rounded-full blur-3xl"
            animate={{ y: [0, 20, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Bottom curve */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" className="w-full h-20 sm:h-24">
              <path
                fill="white"
                d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"
              />
            </svg>
          </div>
        </div>

        {/* Navbar */}
        <nav className="relative z-20 px-4 sm:px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105">
                <Image
                  src="/verified-doctor-logo.svg"
                  alt="Verified.Doctor"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-sm sm:text-base font-semibold text-white/90">
                verified<span className="text-cyan-200">.doctor</span>
              </span>
            </Link>

            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm"
            >
              Claim yours →
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20 sm:pb-28">
          <div className="flex flex-col items-center text-center">
            {/* Large Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mb-6"
            >
              <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full ring-4 ring-white shadow-2xl overflow-hidden">
                {profile.profile_photo_url ? (
                  <Image
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-300 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              {/* Verified Badge - Floating */}
              {profile.is_verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-lg">
                    <Shield className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-semibold text-teal-700">Verified</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight"
            >
              {profile.full_name}
            </motion.h1>

            {/* Specialty with icon */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-2 mb-4"
            >
              <Heart className="w-5 h-5 text-cyan-200" />
              <p className="text-lg sm:text-xl text-cyan-100 font-medium">
                {profile.specialty}
              </p>
            </motion.div>

            {/* Quick Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6"
            >
              {profile.years_experience && (
                <div className="flex items-center gap-1.5 text-white/80">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{profile.years_experience}+ Years</span>
                </div>
              )}
              {profile.clinic_location && (
                <div className="flex items-center gap-1.5 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{profile.clinic_location}</span>
                </div>
              )}
              {recommendationText && (
                <div className="flex items-center gap-1.5 text-white/80">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{profile.recommendation_count} Recommendations</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 -mt-8 pb-28 sm:pb-32">

        {/* Action Card - Floating above */}
        {profile.external_booking_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-6"
          >
            <Button
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 text-white h-14 rounded-2xl font-semibold text-lg shadow-xl shadow-teal-500/30"
              asChild
            >
              <a
                href={profile.external_booking_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
                <ExternalLink className="w-4 h-4 ml-2 opacity-60" />
              </a>
            </Button>
          </motion.div>
        )}

        {/* Invited By */}
        {invitedBy && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="flex justify-center mb-5"
          >
            <Link
              href={`/${invitedBy.handle}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-sm text-teal-700 hover:bg-teal-100 transition-colors"
            >
              <Handshake className="w-4 h-4" />
              <span>
                Invited by <span className="font-semibold">{invitedBy.full_name}</span>
              </span>
            </Link>
          </motion.div>
        )}

        {/* Credentials Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {profile.qualifications && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-700 font-medium">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              {profile.qualifications}
            </span>
          )}
          {profile.languages && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-700 font-medium">
              <Globe className="w-4 h-4 text-teal-600" />
              {profile.languages}
            </span>
          )}
        </motion.div>

        {/* Bio */}
        {profile.bio && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.4 }}
            className="text-center mb-8"
          >
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {showFullBio ? profile.bio : bioTruncated}
            </p>
            {showBioToggle && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="mt-2 text-teal-600 text-sm font-medium inline-flex items-center gap-1 hover:text-teal-700"
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

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {profile.clinic_name && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 text-center border border-teal-100">
              <MapPin className="w-5 h-5 text-teal-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-0.5">Clinic</p>
              <p className="text-sm font-semibold text-slate-800 line-clamp-2">{profile.clinic_name}</p>
            </div>
          )}
          {profile.consultation_fee && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 text-center border border-teal-100">
              <Sparkles className="w-5 h-5 text-teal-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-0.5">Consultation</p>
              <p className="text-sm font-semibold text-slate-800">{profile.consultation_fee}</p>
            </div>
          )}
          {connectionText && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 text-center border border-teal-100">
              <Users className="w-5 h-5 text-teal-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-0.5">Network</p>
              <p className="text-sm font-semibold text-slate-800">{profile.connection_count} Doctors</p>
            </div>
          )}
          {profile.registration_number && (
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 text-center border border-teal-100">
              <CheckCircle2 className="w-5 h-5 text-teal-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 mb-0.5">Reg. No.</p>
              <p className="text-sm font-semibold text-slate-800 truncate">{profile.registration_number}</p>
            </div>
          )}
        </motion.div>

        {/* Profile Sections */}
        <div className="space-y-5 mb-8">
          {isSectionVisible(visibility, "video") && profile.video_introduction_url && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
              <VideoIntroduction url={profile.video_introduction_url} doctorName={firstName} themeColors={themeColors} />
            </motion.div>
          )}

          {(isSectionVisible(visibility, "availability") || isSectionVisible(visibility, "telemedicine")) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.77 }} className="space-y-3">
              {isSectionVisible(visibility, "availability") && profile.is_available !== null && (
                <AvailabilityBadge isAvailable={profile.is_available} availabilityNote={profile.availability_note || undefined} themeColors={themeColors} />
              )}
              {isSectionVisible(visibility, "telemedicine") && profile.offers_telemedicine && (
                <TelemedicineBadge offersTelemedicine={profile.offers_telemedicine} themeColors={themeColors} />
              )}
            </motion.div>
          )}

          {isSectionVisible(visibility, "education") && Array.isArray(profile.education_timeline) && profile.education_timeline.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.79 }}>
              <EducationTimeline items={profile.education_timeline as Array<{institution: string; degree: string; year: string}>} themeColors={themeColors} />
            </motion.div>
          )}

          {isSectionVisible(visibility, "hospitals") && Array.isArray(profile.hospital_affiliations) && profile.hospital_affiliations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.81 }}>
              <HospitalAffiliations items={profile.hospital_affiliations as Array<{name: string; role: string; department?: string}>} themeColors={themeColors} />
            </motion.div>
          )}

          {(isSectionVisible(visibility, "conditions") || isSectionVisible(visibility, "procedures")) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.83 }}>
              <ConditionsProcedures
                conditions={isSectionVisible(visibility, "conditions") ? profile.conditions_treated || undefined : undefined}
                procedures={isSectionVisible(visibility, "procedures") ? profile.procedures_performed || undefined : undefined}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {isSectionVisible(visibility, "approach") && profile.approach_to_care && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>
              <ApproachToCare content={profile.approach_to_care} themeColors={themeColors} />
            </motion.div>
          )}

          {isSectionVisible(visibility, "cases") && Array.isArray(profile.case_studies) && profile.case_studies.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.87 }}>
              <CaseStudies items={profile.case_studies as Array<{title: string; description: string; outcome?: string}>} themeColors={themeColors} />
            </motion.div>
          )}

          {isSectionVisible(visibility, "firstVisit") && profile.first_visit_guide && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.89 }}>
              <FirstVisitGuide content={profile.first_visit_guide} themeColors={themeColors} />
            </motion.div>
          )}

          {isSectionVisible(visibility, "memberships") && Array.isArray(profile.professional_memberships) && profile.professional_memberships.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.91 }}>
              <ProfessionalMemberships items={profile.professional_memberships as Array<{organization: string; year?: string}>} themeColors={themeColors} />
            </motion.div>
          )}

          {isSectionVisible(visibility, "media") && Array.isArray(profile.media_publications) && profile.media_publications.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.93 }}>
              <MediaPublications items={profile.media_publications as Array<{title: string; publication: string; link?: string; year?: string}>} themeColors={themeColors} />
            </motion.div>
          )}

          {isSectionVisible(visibility, "gallery") && Array.isArray(profile.clinic_gallery) && profile.clinic_gallery.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
              <ClinicGallery images={profile.clinic_gallery as Array<{url: string; caption?: string}>} themeColors={themeColors} />
            </motion.div>
          )}
        </div>

        {/* Recommendation Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.97 }}
          className="bg-gradient-to-br from-teal-500 to-cyan-400 rounded-2xl p-6 sm:p-8 text-center mb-8 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <Heart className="w-10 h-10 text-white/80 mx-auto mb-3" />
            <p className="text-white text-lg sm:text-xl font-medium mb-4">
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
            transition={{ delay: 1 }}
            className="mb-8"
          >
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-full text-sm text-teal-700 font-medium"
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
            transition={{ delay: 1.02 }}
            className="mb-6"
          >
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Professional Network
            </h3>
            <div className="flex -space-x-2">
              {connectedDoctors.slice(0, 8).map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/${doctor.handle}`}
                  className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full ring-3 ring-white hover:z-10 hover:scale-110 transition-transform shadow-sm"
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
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-400 to-cyan-300 flex items-center justify-center text-white text-xs font-bold">
                      {doctor.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                </Link>
              ))}
              {connectedDoctors.length > 8 && (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-teal-100 ring-3 ring-white flex items-center justify-center text-xs font-semibold text-teal-700">
                  +{connectedDoctors.length - 8}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      <ProfileActions profile={profile} />
    </div>
  );
}
