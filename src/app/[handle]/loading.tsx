"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Premium shimmer effect keyframes
const shimmerAnimation = {
  initial: { backgroundPosition: "-200% 0" },
  animate: { backgroundPosition: "200% 0" },
};

// Skeleton component with elegant shimmer
function Shimmer({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(90deg, #f1f5f9 0%, #e8f4fc 20%, #f1f5f9 40%, #f1f5f9 100%)",
        backgroundSize: "200% 100%",
        ...style,
      }}
      initial="initial"
      animate="animate"
      variants={shimmerAnimation}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Circular shimmer for avatar
function AvatarShimmer() {
  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
      {/* Subtle glow behind avatar */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0099F7]/10 to-[#A4FDFF]/10 rounded-full blur-xl" />
      <motion.div
        className="relative z-10 w-full h-full rounded-full border-3 border-white shadow-lg overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f1f5f9 0%, #e8f4fc 25%, #f1f5f9 50%, #e8f4fc 75%, #f1f5f9 100%)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/50 to-white">
      {/* Subtle gradient orbs - matching real template */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0099F7]/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#A4FDFF]/[0.03] rounded-full blur-3xl" />
      </div>

      {/* Navbar skeleton - matches real navbar */}
      <nav className="relative z-20 px-4 sm:px-6 py-3 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="relative w-6 h-6 sm:w-7 sm:h-7"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/verified-doctor-logo.svg"
                alt="Verified.Doctor"
                fill
                className="object-contain"
              />
            </motion.div>
            <span className="text-sm sm:text-base font-semibold text-slate-800">
              verified<span className="text-[#0099F7]">.doctor</span>
            </span>
          </Link>
          <Shimmer className="h-5 w-20 rounded-md" />
        </div>
      </nav>

      {/* Profile Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-28 sm:pb-32">
        {/* Hero Section - Matches real layout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="flex justify-center sm:justify-start">
              <AvatarShimmer />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col items-center sm:items-start">
              {/* Name + Badge */}
              <div className="flex items-center gap-2 mb-2">
                <Shimmer className="h-7 sm:h-8 w-48 sm:w-56 rounded-lg" />
                <motion.div
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/verified-doctor-logo.svg"
                    alt="Verified"
                    width={32}
                    height={32}
                    className="object-contain opacity-30"
                  />
                </motion.div>
              </div>

              {/* Verified capsule skeleton */}
              <Shimmer className="h-5 w-28 rounded-full mb-2" />

              {/* Specialty */}
              <Shimmer className="h-5 w-32 rounded-md mb-3" />

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Shimmer className="h-4 w-24 rounded-md" />
                <Shimmer className="h-4 w-16 rounded-md" />
                <Shimmer className="h-4 w-20 rounded-md" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Credential Badges Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6"
        >
          <Shimmer className="h-6 w-24 rounded-full" />
          <Shimmer className="h-6 w-32 rounded-full" />
          <Shimmer className="h-6 w-20 rounded-full" />
        </motion.div>

        {/* Bio Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4"
        >
          <Shimmer className="h-4 w-full rounded-md mb-2" />
          <Shimmer className="h-4 w-5/6 rounded-md mb-2" />
          <Shimmer className="h-4 w-4/6 rounded-md" />
        </motion.div>

        {/* Services Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Shimmer key={i} className="h-7 rounded-full" style={{ width: `${60 + i * 12}px` }} />
          ))}
        </motion.div>

        {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {/* Recommendations Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shimmer className="w-8 h-8 rounded-lg" />
              <Shimmer className="h-4 w-16 rounded-md" />
            </div>
            <Shimmer className="h-6 w-20 rounded-md mb-1" />
            <Shimmer className="h-3 w-24 rounded-md" />
          </div>

          {/* Connections Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shimmer className="w-8 h-8 rounded-lg" />
              <Shimmer className="h-4 w-16 rounded-md" />
            </div>
            <Shimmer className="h-6 w-20 rounded-md mb-1" />
            <Shimmer className="h-3 w-24 rounded-md" />
          </div>
        </motion.div>

        {/* Connected Doctors Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6"
        >
          <Shimmer className="h-5 w-40 rounded-md mb-4" />
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
                <Shimmer className="w-14 h-14 rounded-full" />
                <Shimmer className="h-3 w-16 rounded-md" />
                <Shimmer className="h-2 w-12 rounded-md" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendation CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 p-6 text-center mb-8"
        >
          <Shimmer className="h-5 w-48 rounded-md mx-auto mb-4" />
          <Shimmer className="h-12 w-56 rounded-xl mx-auto" />
        </motion.div>
      </main>

      {/* Sticky Action Bar - matches real template */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 sm:py-4"
      >
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
          <Shimmer className="h-10 sm:h-11 flex-1 max-w-[140px] rounded-lg" />
          <Shimmer className="h-10 sm:h-11 flex-1 max-w-[140px] rounded-lg" />
          <Shimmer className="h-10 sm:h-11 flex-1 max-w-[140px] rounded-lg" />
        </div>
      </motion.div>
    </div>
  );
}
