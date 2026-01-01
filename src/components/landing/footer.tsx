"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="relative w-8 h-8">
              <Image
                src="/verified-doctor-logo.svg"
                alt="Verified.Doctor"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">
              verified<span className="text-[#A4FDFF]">.doctor</span>
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-md">
            The Blue Checkmark for Medical Professionals. Build your verified
            digital identity.
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8 text-sm">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/contact"
              className="text-slate-400 hover:text-white transition-colors duration-200"
            >
              Contact
            </Link>
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-slate-800 mb-8" />

          {/* Copyright */}
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} Verified.Doctor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
