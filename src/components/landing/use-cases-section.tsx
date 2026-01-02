"use client";

import { motion } from "framer-motion";
import { UserPlus, FileCheck, Share2, Star, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Claim Your URL",
    description: "Choose your unique verified.doctor handle. It takes just seconds.",
    color: "from-sky-500 to-cyan-400",
  },
  {
    number: "02",
    icon: FileCheck,
    title: "Build Your Profile",
    description: "Add your credentials, bio, and photo. AI helps you write compelling content.",
    color: "from-violet-500 to-purple-400",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share Everywhere",
    description: "Display your QR code in your clinic. Share your link with patients.",
    color: "from-amber-500 to-orange-400",
  },
  {
    number: "04",
    icon: Star,
    title: "Grow Your Reputation",
    description: "Collect patient recommendations and connect with fellow doctors.",
    color: "from-emerald-500 to-teal-400",
  },
];

export function UseCasesSection() {
  return (
    <section className="py-20 sm:py-28 bg-slate-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-300 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5">
            Go Live in
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              {" "}Under 5 Minutes
            </span>
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto">
            From signup to verified professional in four simple steps
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-24 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gradient-to-r from-sky-500/50 via-violet-500/50 via-amber-500/50 to-emerald-500/50" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
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
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
                  {/* Number badge */}
                  <div className={`relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Step number */}
                  <div className="absolute top-6 right-6 text-5xl font-bold text-slate-800 select-none">
                    {step.number}
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile/tablet */}
                {index < steps.length - 1 && (
                  <div className="flex lg:hidden justify-center py-4">
                    <ArrowRight className="w-5 h-5 text-slate-600 rotate-90 sm:rotate-0" />
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
