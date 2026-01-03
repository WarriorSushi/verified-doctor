"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  ThumbsUp,
  Users,
  QrCode,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden relative">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-200/50 text-sky-700 text-sm font-medium mb-4"
          >
            <Zap className="w-3.5 h-3.5" />
            Why Choose Verified.Doctor
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5 tracking-tight">
            Everything You Need to
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              {" "}Build Trust Online
            </span>
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">
            A complete platform designed specifically for medical professionals
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 auto-rows-[minmax(160px,auto)]">

          {/* Hero Card - Verified Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sm:col-span-2 lg:col-span-7 lg:row-span-2 group"
          >
            <div className="relative h-full bg-gradient-to-br from-[#0099F7] via-[#00B4D8] to-[#48CAE4] rounded-3xl p-6 sm:p-8 overflow-hidden min-h-[320px] sm:min-h-[380px] cursor-pointer">
              {/* Floating orbs */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-white/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 group-hover:translate-x-1/4 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-300/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 group-hover:translate-y-1/4 transition-transform duration-700" />

              {/* Decorative grid pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }} />

              {/* Floating badge illustration */}
              <motion.div
                className="absolute top-8 right-8 sm:top-12 sm:right-12"
                animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
                    <BadgeCheck className="w-10 h-10 sm:w-14 sm:h-14 text-white drop-shadow-lg" />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-3 h-3 text-white fill-white" />
                  </motion.div>
                </div>
              </motion.div>

              <div className="relative z-10 h-full flex flex-col justify-end">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
                  Verified Badge
                </h3>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-md">
                  Stand out with an authenticated credential that patients trust instantly. The blue checkmark for doctors.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                    <span className="text-white/90 text-sm font-medium">+47% Trust</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    <Users className="w-4 h-4 text-cyan-200" />
                    <span className="text-white/90 text-sm font-medium">650+ Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* No Negative Reviews Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 group"
          >
            <div className="relative h-full bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-400 rounded-2xl p-5 sm:p-6 overflow-hidden min-h-[180px] cursor-pointer">
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />

              {/* Thumbs up illustration */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                <ThumbsUp className="w-24 h-24 text-white transform rotate-12" />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <ThumbsUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  No Negative Reviews
                </h3>
                <p className="text-white/90 text-sm leading-relaxed flex-grow">
                  Collect recommendations only. Your reputation can only grow.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-white/30 border-2 border-emerald-400 flex items-center justify-center">
                        <ThumbsUp className="w-3 h-3 text-white" />
                      </div>
                    ))}
                  </div>
                  <span className="text-white/80 text-xs">12.5k+ received</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Doctor Network Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 group"
          >
            <div className="relative h-full bg-slate-900 rounded-2xl p-5 sm:p-6 overflow-hidden min-h-[180px] cursor-pointer border border-slate-800 hover:border-slate-700 transition-colors">
              {/* Gradient accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl" />

              {/* Network visualization */}
              <div className="absolute top-4 right-4 opacity-60 group-hover:opacity-80 transition-opacity">
                <svg width="80" height="80" viewBox="0 0 80 80" className="text-violet-400">
                  <circle cx="40" cy="40" r="6" fill="currentColor" />
                  <circle cx="20" cy="25" r="4" fill="currentColor" opacity="0.6" />
                  <circle cx="60" cy="20" r="4" fill="currentColor" opacity="0.6" />
                  <circle cx="65" cy="55" r="4" fill="currentColor" opacity="0.6" />
                  <circle cx="15" cy="55" r="4" fill="currentColor" opacity="0.6" />
                  <line x1="40" y1="40" x2="20" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <line x1="40" y1="40" x2="60" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <line x1="40" y1="40" x2="65" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  <line x1="40" y1="40" x2="15" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                </svg>
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-violet-500/25">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Doctor Network
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">
                  Connect with peers and showcase your professional network.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-300">
                        {['DK', 'PS', 'AM', '+'][i]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* QR Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-4 group"
          >
            <div className="relative h-full bg-white rounded-2xl p-5 sm:p-6 overflow-hidden min-h-[180px] border border-slate-200 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 cursor-pointer">
              {/* QR Code illustration */}
              <div className="absolute top-4 right-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <div className="w-full h-full grid grid-cols-4 gap-0.5">
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${[0,1,2,4,5,8,10,11,12,14,15].includes(i) ? 'bg-slate-800' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/25">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  QR Code
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                  Scannable code for your clinic. Patients save your contact instantly.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Patient Messaging Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-4 group"
          >
            <div className="relative h-full bg-white rounded-2xl p-5 sm:p-6 overflow-hidden min-h-[180px] border border-slate-200 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300 cursor-pointer">
              {/* Message bubbles illustration */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <motion.div
                  className="w-20 h-5 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 self-end"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="w-16 h-5 rounded-full bg-gradient-to-r from-slate-100 to-slate-50"
                  animate={{ x: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="w-14 h-5 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 self-end"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rose-500/25">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Patient Messaging
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                  Secure async messaging without sharing your personal number.
                </p>
              </div>
            </div>
          </motion.div>

          {/* AI-Powered Card - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-4 group"
          >
            <div className="relative h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 overflow-hidden min-h-[180px] cursor-pointer border border-indigo-500/20">
              {/* Animated gradient orb */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(236,72,153,0.3) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ filter: 'blur(20px)' }}
              />

              {/* Sparkles */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${15 + (i * 10)}%`,
                      top: `${20 + (i % 4) * 15}%`,
                    }}
                    animate={{
                      opacity: [0.2, 0.8, 0.2],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2 + (i * 0.2),
                      delay: i * 0.15,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs font-medium">Free</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  AI-Powered Profiles
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Let AI craft your perfect professional bio and content.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
