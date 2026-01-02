"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote: "Finally, a platform that understands what doctors need. My patients can now find and verify me instantly. The QR code in my clinic has been a game changer.",
    name: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    location: "Mumbai",
    image: "/doctors/doctor-1.jpg",
  },
  {
    quote: "I was skeptical at first, but the no-negative-reviews policy won me over. My recommendations keep growing, and it feels great to have a reputation system that works for doctors.",
    name: "Dr. Arjun Mehta",
    specialty: "Orthopedic Surgeon",
    location: "Delhi",
    image: "/doctors/doctor-2.jpg",
  },
  {
    quote: "The AI-powered profile builder saved me hours. It helped me articulate my approach to patient care in a way I never could have done alone.",
    name: "Dr. Fatima Khan",
    specialty: "Dermatologist",
    location: "Bangalore",
    image: "/doctors/doctor-3.jpg",
  },
  {
    quote: "Being connected with other verified doctors in my network has opened doors to referrals I never expected. This platform is more than just a profile page.",
    name: "Dr. Vikram Patel",
    specialty: "Neurologist",
    location: "Chennai",
    image: "/doctors/doctor-4.jpg",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  };

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-sky-50 via-white to-cyan-50 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-700 text-sm font-medium mb-4">
            What Doctors Say
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
            Trusted by Medical
            <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
              {" "}Professionals
            </span>
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          {/* Main testimonial card */}
          <div className="relative bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[320px] sm:min-h-[280px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="p-6 sm:p-10"
              >
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 to-slate-100">
                      <Image
                        src={current.image}
                        alt={current.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Quote className="w-8 h-8 text-sky-200 mb-3 -ml-1" />
                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6">
                      &ldquo;{current.quote}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold text-slate-900">{current.name}</p>
                      <p className="text-slate-500 text-sm">
                        {current.specialty} • {current.location}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2">
              <button
                onClick={() => paginate(-1)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={() => paginate(1)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-sky-500"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
