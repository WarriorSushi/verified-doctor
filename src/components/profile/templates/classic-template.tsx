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

interface ClassicTemplateProps {
  profile: Profile;
  connectedDoctors: ConnectedDoctor[];
}

export function ClassicTemplate({ profile, connectedDoctors }: ClassicTemplateProps) {
  const recommendationText = formatRecommendationCount(profile.recommendation_count || 0);
  const connectionText = formatConnectionCount(profile.connection_count || 0);
  const services = profile.services?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const firstName = profile.full_name.split(" ")[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Subtle gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0099F7]/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#A4FDFF]/[0.05] rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
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
            <span className="text-base font-semibold text-slate-800">
              verified<span className="text-[#0099F7]">.doctor</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-[#0099F7] hover:text-[#0080CC] transition-colors"
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
          {/* Avatar */}
          <div className="relative w-28 h-28 mx-auto mb-5">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0099F7] to-[#0080CC] rounded-full blur-xl opacity-20" />
            {profile.profile_photo_url ? (
              <Image
                src={profile.profile_photo_url}
                alt={profile.full_name}
                fill
                className="object-cover rounded-full border-4 border-white shadow-xl relative z-10"
              />
            ) : (
              <div className="relative z-10 w-full h-full rounded-full bg-gradient-to-br from-[#0099F7] to-[#0080CC] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-xl">
                {profile.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + Verified Badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
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
          <p className="text-[#0099F7] font-medium mb-3">{profile.specialty}</p>

          {/* Quick Info Pills */}
          <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-600">
            {profile.qualifications && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
                <GraduationCap className="w-3.5 h-3.5" />
                {profile.qualifications}
              </span>
            )}
            {profile.years_experience && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
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
            <p className="text-slate-600 leading-relaxed text-center">
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
                <div className="flex items-center justify-center gap-1.5 text-[#0099F7] mb-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-xl font-bold">{profile.recommendation_count}</span>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Recommendations</p>
              </div>
            )}
            {connectionText && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-slate-700 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xl font-bold">{profile.connection_count}</span>
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Connections</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <div className="grid gap-5">
            {/* Location */}
            {(profile.clinic_name || profile.clinic_location) && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0099F7]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#0099F7]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Location</p>
                  <p className="text-slate-800 font-medium">
                    {[profile.clinic_name, profile.clinic_location].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Languages */}
            {profile.languages && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0099F7]/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-[#0099F7]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Languages</p>
                  <p className="text-slate-800 font-medium">{profile.languages}</p>
                </div>
              </div>
            )}

            {/* Consultation Fee */}
            {profile.consultation_fee && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0099F7]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#0099F7]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Consultation</p>
                  <p className="text-slate-800 font-medium">{profile.consultation_fee}</p>
                </div>
              </div>
            )}

            {/* Registration */}
            {profile.registration_number && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0099F7]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#0099F7]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">Registration</p>
                  <p className="text-slate-800 font-medium">{profile.registration_number}</p>
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
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3 text-center">Services</p>
            <div className="flex flex-wrap justify-center gap-2">
              {services.map((service, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-700 font-medium shadow-sm hover:border-[#0099F7]/30 hover:bg-[#0099F7]/5 transition-colors"
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
              className="w-full bg-[#0099F7] hover:bg-[#0080CC] text-white h-12 rounded-xl font-medium shadow-lg shadow-[#0099F7]/20"
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
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3 text-center">
              Professional Network
            </p>
            <div className="flex justify-center -space-x-3">
              {connectedDoctors.slice(0, 5).map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/${doctor.handle}`}
                  className="relative w-10 h-10 rounded-full border-2 border-white shadow-sm hover:z-10 hover:scale-110 transition-transform"
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
              {connectedDoctors.length > 5 && (
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-xs font-medium text-slate-600">
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
          className="bg-gradient-to-br from-[#0099F7]/5 to-[#A4FDFF]/10 rounded-2xl p-6 text-center border border-[#0099F7]/10"
        >
          <p className="text-slate-600 mb-4">
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
