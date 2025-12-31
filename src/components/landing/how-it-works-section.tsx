"use client";

import { motion } from "framer-motion";
import { Globe, User, QrCode } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Globe,
    title: "Claim your URL",
    description: "Reserve your unique verified.doctor/yourname URL",
  },
  {
    number: "2",
    icon: User,
    title: "Build your profile",
    description: "Add your credentials in under 2 minutes",
  },
  {
    number: "3",
    icon: QrCode,
    title: "Share your QR code",
    description: "Display in your clinic for patients to scan",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            Get your verified digital presence up and running in minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - hidden on mobile */}
          <div className="hidden md:block absolute top-[60px] left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-slate-200 via-[#0099F7]/30 to-slate-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step Number Circle */}
                <div className="relative z-10 mb-5 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#0099F7] to-[#0080CC] flex items-center justify-center">
                      <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center shadow-md">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base max-w-xs">
                  {step.description}
                </p>

                {/* Arrow on mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden mt-6 text-slate-300">
                    <svg
                      className="w-6 h-6 rotate-90"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
