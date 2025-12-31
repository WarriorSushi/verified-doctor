"use client";

import { motion } from "framer-motion";
import { BadgeCheck, ThumbsUp, Users } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified Badge",
    description:
      "Stand out with a verified credential that patients trust. Your digital identity, authenticated.",
  },
  {
    icon: ThumbsUp,
    title: "Patient Recommendations",
    description:
      "Collect recommendations — no negative reviews, ever. A reputation system that only grows.",
  },
  {
    icon: Users,
    title: "Doctor Network",
    description:
      "Connect with peers and showcase your professional network. Build credibility through connections.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
            Why Doctors Choose Us
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            Everything you need to establish and protect your professional
            digital presence.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#0099F7]/10 to-[#A4FDFF]/10 mb-5 sm:mb-6 group-hover:from-[#0099F7]/20 group-hover:to-[#A4FDFF]/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#0099F7]" />
              </div>

              {/* Content */}
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative gradient line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#0099F7] to-[#A4FDFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
