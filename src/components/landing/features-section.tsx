"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  ThumbsUp,
  Users,
  QrCode,
  MessageSquare,
  Sparkles,
  Shield,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified Badge",
    description: "Stand out with an authenticated credential that patients trust instantly.",
    gradient: "from-sky-500 to-cyan-400",
    size: "large",
  },
  {
    icon: ThumbsUp,
    title: "No Negative Reviews",
    description: "Collect recommendations only. A reputation system that can only grow.",
    gradient: "from-emerald-500 to-teal-400",
    size: "medium",
  },
  {
    icon: Users,
    title: "Doctor Network",
    description: "Connect with peers and showcase your professional network.",
    gradient: "from-violet-500 to-purple-400",
    size: "medium",
  },
  {
    icon: QrCode,
    title: "QR Code",
    description: "Scannable code for your clinic. Patients save your contact instantly.",
    gradient: "from-amber-500 to-orange-400",
    size: "small",
  },
  {
    icon: MessageSquare,
    title: "Patient Messaging",
    description: "Secure async messaging without sharing your personal number.",
    gradient: "from-rose-500 to-pink-400",
    size: "small",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Profiles",
    description: "Let AI help you craft the perfect professional bio and content.",
    gradient: "from-indigo-500 to-blue-400",
    size: "large",
  },
];

const stats = [
  { icon: Shield, value: "100%", label: "Secure" },
  { icon: Globe, value: "24/7", label: "Accessible" },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
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
            className="inline-block px-4 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-sm font-medium mb-4"
          >
            Why Choose Verified.Doctor
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5">
            Everything You Need to
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
              {" "}Build Trust Online
            </span>
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">
            A complete platform designed specifically for medical professionals
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Large Card - Verified Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sm:col-span-2 lg:col-span-2 lg:row-span-2 group"
          >
            <div className="relative h-full bg-gradient-to-br from-sky-500 to-cyan-400 rounded-3xl p-6 sm:p-8 overflow-hidden min-h-[280px] sm:min-h-[360px]">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BadgeCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {features[0].title}
                </h3>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed flex-grow">
                  {features[0].description}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2 text-white/80">
                      <stat.icon className="w-4 h-4" />
                      <span className="font-semibold">{stat.value}</span>
                      <span className="text-sm">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medium Cards */}
          {features.slice(1, 3).map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 hover:shadow-lg hover:border-slate-300/80 transition-all duration-300 min-h-[180px]">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Small Cards Row */}
          {features.slice(3, 5).map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-slate-900 rounded-2xl p-5 sm:p-6 hover:bg-slate-800 transition-colors duration-300 min-h-[160px]">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* AI Feature - Wide Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="sm:col-span-2 group"
          >
            <div className="relative h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 overflow-hidden min-h-[180px]">
              {/* Animated sparkles background */}
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 3) * 20}%`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {features[5].title}
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    {features[5].description}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-sm font-medium">Free to use</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
