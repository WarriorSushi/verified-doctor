"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "vd_cookie_consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Wait a bit before showing the banner
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4"
        >
          <div className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden">
            <div className="p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <div className="hidden sm:flex flex-shrink-0 w-9 h-9 rounded-full bg-sky-100 items-center justify-center">
                  <Cookie className="w-4 h-4 text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 mb-3">
                    <span className="sm:hidden">We use cookies. </span>
                    <span className="hidden sm:inline">We use cookies to improve your experience. </span>
                    <Link href="/privacy" className="text-sky-600 hover:underline">
                      Learn more
                    </Link>
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={acceptAll}
                      size="sm"
                      className="bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={acceptEssential}
                      variant="outline"
                      size="sm"
                      className="border-slate-300 text-xs sm:text-sm"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
                <button
                  onClick={acceptEssential}
                  className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Close cookie banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
