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
  // New profile builder fields
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

interface ClassicTemplateProps {
  profile: Profile;
  connectedDoctors: ConnectedDoctor[];
  invitedBy?: InvitedBy | null;
}

// Helper to check section visibility
function isSectionVisible(visibility: unknown, key: string): boolean {
  if (!visibility || typeof visibility !== "object") return true;
  const v = visibility as Record<string, boolean>;
  return v[key] !== false;
}

// Theme colors for classic template
const themeColors = {
  primary: "#0099F7",
  accent: "#A4FDFF",
};

export function ClassicTemplate({ profile, connectedDoctors, invitedBy }: ClassicTemplateProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const recommendationText = formatRecommendationCount(profile.recommendation_count || 0);
  const connectionText = formatConnectionCount(profile.connection_count || 0);
  const services = profile.services?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const firstName = profile.full_name.split(" ")[0];
  const visibility = profile.section_visibility;

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
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0099F7] to-[#0080CC] rounded-full blur-lg opacity-20" />
                {profile.profile_photo_url ? (
                  <Image
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    fill
                    className="object-cover rounded-full border-3 border-white shadow-lg relative z-10"
                  />
                ) : (
                  <div className="relative z-10 w-full h-full rounded-full bg-gradient-to-br from-[#0099F7] to-[#0080CC] flex items-center justify-center text-white text-3xl sm:text-4xl font-bold border-3 border-white shadow-lg">
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

              {/* Verified Capsule */}
              {profile.is_verified && (
                <div className="flex justify-center sm:justify-start mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] sm:text-xs font-medium text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Physician
                  </span>
                </div>
              )}

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
                        {profile.recommendation_count} {profile.recommendation_count === 1 ? "recommendation" : "recommendations"}
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0099F7]/10 to-[#A4FDFF]/20 border border-[#0099F7]/20 rounded-full text-xs sm:text-sm text-[#0080CC] hover:bg-[#0099F7]/15 transition-colors"
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>
                Invited by <span className="font-medium">{invitedBy.full_name}</span>
                {invitedBy.specialty && <span className="text-[#0099F7]/70"> ({invitedBy.specialty})</span>}
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

        {/* NEW PROFILE SECTIONS */}
        <div className="space-y-4 mb-6">
          {/* Video Introduction */}
          {isSectionVisible(visibility, "video") && profile.video_introduction_url && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <VideoIntroduction
                url={profile.video_introduction_url}
                doctorName={firstName}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {/* Availability & Telemedicine */}
          {(isSectionVisible(visibility, "availability") || isSectionVisible(visibility, "telemedicine")) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.32 }}
              className="space-y-3"
            >
              {isSectionVisible(visibility, "availability") && profile.is_available !== null && (
                <AvailabilityBadge
                  isAvailable={profile.is_available}
                  availabilityNote={profile.availability_note || undefined}
                  themeColors={themeColors}
                />
              )}
              {isSectionVisible(visibility, "telemedicine") && profile.offers_telemedicine && (
                <TelemedicineBadge
                  offersTelemedicine={profile.offers_telemedicine}
                  themeColors={themeColors}
                />
              )}
            </motion.div>
          )}

          {/* Education Timeline */}
          {isSectionVisible(visibility, "education") && Array.isArray(profile.education_timeline) && profile.education_timeline.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.34 }}
            >
              <EducationTimeline
                items={profile.education_timeline as Array<{institution: string; degree: string; year: string}>}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {/* Hospital Affiliations */}
          {isSectionVisible(visibility, "hospitals") && Array.isArray(profile.hospital_affiliations) && profile.hospital_affiliations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.36 }}
            >
              <HospitalAffiliations
                items={profile.hospital_affiliations as Array<{name: string; role: string; department?: string}>}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {/* Conditions & Procedures */}
          {(isSectionVisible(visibility, "conditions") || isSectionVisible(visibility, "procedures")) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.38 }}
            >
              <ConditionsProcedures
                conditions={isSectionVisible(visibility, "conditions") ? profile.conditions_treated || undefined : undefined}
                procedures={isSectionVisible(visibility, "procedures") ? profile.procedures_performed || undefined : undefined}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {/* Approach to Care */}
          {isSectionVisible(visibility, "approach") && profile.approach_to_care && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <ApproachToCare
                content={profile.approach_to_care}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {/* Case Studies */}
          {isSectionVisible(visibility, "cases") && Array.isArray(profile.case_studies) && profile.case_studies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.42 }}
            >
              <CaseStudies
                items={profile.case_studies as Array<{title: string; description: string; outcome?: string}>}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {/* First Visit Guide */}
          {isSectionVisible(visibility, "firstVisit") && profile.first_visit_guide && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.44 }}
            >
              <FirstVisitGuide
                content={profile.first_visit_guide}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {/* Professional Memberships */}
          {isSectionVisible(visibility, "memberships") && Array.isArray(profile.professional_memberships) && profile.professional_memberships.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.46 }}
            >
              <ProfessionalMemberships
                items={profile.professional_memberships as Array<{organization: string; year?: string}>}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {/* Media & Publications */}
          {isSectionVisible(visibility, "media") && Array.isArray(profile.media_publications) && profile.media_publications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.48 }}
            >
              <MediaPublications
                items={profile.media_publications as Array<{title: string; publication: string; link?: string; year?: string}>}
                themeColors={themeColors}
              />
            </motion.div>
          )}

          {/* Clinic Gallery */}
          {isSectionVisible(visibility, "gallery") && Array.isArray(profile.clinic_gallery) && profile.clinic_gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <ClinicGallery
                images={profile.clinic_gallery as Array<{url: string; caption?: string}>}
                themeColors={themeColors}
              />
            </motion.div>
          )}
        </div>

        {/* Recommendation Section - Prominent placement */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.52 }}
          className="bg-gradient-to-br from-[#0099F7]/10 to-[#A4FDFF]/20 rounded-2xl p-5 sm:p-6 text-center border border-[#0099F7]/20 mb-6 relative overflow-hidden"
        >
          {/* Animated pulse background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#0099F7]/5 via-[#A4FDFF]/10 to-[#0099F7]/5"
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
            <p className="text-slate-700 text-base sm:text-lg font-medium mb-4">
              Show your appreciation for {profile.full_name} by clicking below
            </p>
            <RecommendButton profileId={profile.id} />
          </div>
        </motion.div>

        {/* Services - Horizontal scroll on mobile */}
        {services.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mb-6"
          >
            <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Services</p>
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
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-6"
          >
            <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
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
      </main>

      {/* Sticky Action Buttons */}
      <ProfileActions profile={profile} />
    </div>
  );
}
