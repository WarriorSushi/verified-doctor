"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-4">
      {/* Main loader container */}
      <div className="relative flex flex-col items-center">
        {/* Animated rings around the logo */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#0099F7]/20"
            animate={{
              scale: [1, 1.3, 1.3],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Middle pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#0099F7]/30"
            animate={{
              scale: [1, 1.2, 1.2],
              opacity: [0.6, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.3,
            }}
          />

          {/* Inner rotating ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#0099F7] border-r-[#0099F7]/50"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Logo container with subtle bounce */}
          <motion.div
            className="relative w-16 h-16 z-10"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/verified-doctor-logo.svg"
              alt="Verified.Doctor"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* ECG/Heartbeat line animation */}
        <motion.div className="mt-8 w-48 h-8 overflow-hidden">
          <motion.svg
            viewBox="0 0 200 40"
            className="w-full h-full"
            initial={{ x: 0 }}
            animate={{ x: -200 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Duplicate path for seamless loop */}
            <motion.path
              d="M0 20 L30 20 L35 20 L40 10 L45 30 L50 5 L55 35 L60 20 L65 20 L100 20 L130 20 L135 20 L140 10 L145 30 L150 5 L155 35 L160 20 L165 20 L200 20"
              fill="none"
              stroke="url(#ecgGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0099F7" stopOpacity="0" />
                <stop offset="30%" stopColor="#0099F7" stopOpacity="1" />
                <stop offset="70%" stopColor="#0099F7" stopOpacity="1" />
                <stop offset="100%" stopColor="#0099F7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </motion.svg>
        </motion.div>

        {/* Loading text with typewriter effect */}
        <motion.div
          className="mt-6 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-slate-600 font-medium">Loading profile</span>
          <motion.span
            className="inline-flex"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="w-1.5 h-1.5 bg-[#0099F7] rounded-full mx-0.5" />
            <motion.span
              className="w-1.5 h-1.5 bg-[#0099F7] rounded-full mx-0.5"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="w-1.5 h-1.5 bg-[#0099F7] rounded-full mx-0.5"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
          </motion.span>
        </motion.div>

        {/* Skeleton preview of profile */}
        <motion.div
          className="mt-10 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            {/* Avatar skeleton */}
            <div className="flex flex-col items-center">
              <motion.div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200"
                animate={{
                  background: [
                    "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                    "linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)",
                    "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Name skeleton */}
              <motion.div
                className="mt-4 h-6 w-40 rounded-md bg-slate-100"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Specialty skeleton */}
              <motion.div
                className="mt-2 h-4 w-32 rounded-md bg-slate-100"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
            </div>

            {/* Stats skeleton */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <motion.div
                className="h-16 rounded-lg bg-slate-50 border border-slate-100"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-16 rounded-lg bg-slate-50 border border-slate-100"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
