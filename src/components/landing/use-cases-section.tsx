"use client";

import { motion } from "framer-motion";
import { UserPlus, FileCheck, Share2, Star, ChevronRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Claim Your URL",
    description: "Choose your unique verified.doctor handle. It takes just seconds.",
    gradient: "from-sky-500 to-blue-600",
    bgLight: "bg-sky-50",
    iconColor: "text-sky-600",
    borderColor: "border-sky-200",
  },
  {
    number: "02",
    icon: FileCheck,
    title: "Build Your Profile",
    description: "Add your credentials, bio, and photo. AI helps you write compelling content.",
    gradient: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share Everywhere",
    description: "Display your QR code in your clinic. Share your link with patients.",
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
  },
  {
    number: "04",
    icon: Star,
    title: "Grow Your Reputation",
    description: "Collect patient recommendations and connect with fellow doctors.",
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200",
  },
];

export function UseCasesSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-sky-50/30 overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-700 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5">
            Go Live in
            <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
              {" "}Under 5 Minutes
            </span>
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">
            From signup to verified professional in four simple steps
          </p>
        </motion.div>

        {/* Steps - Horizontal timeline on desktop */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-sky-300 via-violet-300 via-amber-300 to-emerald-300 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Step card */}
                <div className={`relative bg-white rounded-2xl p-6 border ${step.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 h-full`}>
                  {/* Number badge with icon */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`text-4xl font-bold ${step.iconColor} opacity-20`}>
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Subtle gradient overlay on hover */}
                  <div className={`absolute inset-0 ${step.bgLight} opacity-0 group-hover:opacity-50 rounded-2xl transition-opacity duration-300 pointer-events-none`} />
                </div>

                {/* Arrow connector for mobile/tablet */}
                {index < steps.length - 1 && (
                  <div className="flex lg:hidden justify-center py-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-slate-400 rotate-90 sm:rotate-0" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14 sm:mt-20"
        >
          <a
            href="#top"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5"
          >
            Get Started Now
            <ChevronRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
