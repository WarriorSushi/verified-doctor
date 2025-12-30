"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typewriter } from "@/components/shared/typewriter";

type AvailabilityStatus = "idle" | "checking" | "available" | "taken";

export function HeroSection() {
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<AvailabilityStatus>("idle");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [joinedCount, setJoinedCount] = useState(34);

  // Simulate live join count
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setJoinedCount((prev) => prev + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkAvailability = async () => {
    if (!handle.trim()) return;

    setStatus("checking");

    try {
      const response = await fetch("/api/check-handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.toLowerCase().trim() }),
      });

      const data = await response.json();
      setStatus(data.available ? "available" : "taken");
    } catch {
      // For now, simulate availability
      setStatus(Math.random() > 0.3 ? "available" : "taken");
    }
  };

  const handleClaim = () => {
    // Redirect to signup with handle
    window.location.href = `/sign-up?handle=${encodeURIComponent(handle.toLowerCase().trim())}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (status === "available") {
        handleClaim();
      } else {
        checkAvailability();
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0099F7]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#A4FDFF]/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pt-24 pb-16">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0099F7]/10 to-[#A4FDFF]/10 border border-[#0099F7]/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#0099F7] animate-pulse" />
            <span className="text-sm font-medium text-[#0080CC]">
              The Blue Checkmark for Medical Professionals
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Your Digital Identity.
            <br />
            <span className="bg-gradient-to-r from-[#0099F7] to-[#0080CC] bg-clip-text text-transparent">
              Verified.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-600 mb-12 max-w-xl mx-auto"
          >
            Claim your unique URL before another doctor does.
            <br className="hidden md:block" />
            Stand out with a verified professional presence.
          </motion.p>

          {/* URL Input Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <div
              className={`
                relative flex items-center rounded-2xl bg-white border-2 transition-all duration-300 shadow-lg shadow-slate-200/50
                ${isInputFocused ? "border-[#0099F7] shadow-[#0099F7]/10" : "border-slate-200"}
                ${status === "available" ? "border-emerald-500 shadow-emerald-500/10" : ""}
                ${status === "taken" ? "border-red-400 shadow-red-400/10" : ""}
              `}
            >
              {/* URL Prefix */}
              <div className="flex-shrink-0 pl-5 pr-2 py-4 flex items-center">
                <span className="text-slate-500 font-medium text-lg">
                  verified.doctor/
                </span>
              </div>

              {/* Input */}
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                    setStatus("idle");
                  }}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder=""
                  className="border-0 bg-transparent text-lg font-medium text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-4 px-0"
                />
                {/* Typewriter placeholder */}
                {!handle && !isInputFocused && (
                  <div className="absolute inset-0 flex items-center pointer-events-none">
                    <Typewriter isActive={!isInputFocused && !handle} />
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 pr-2">
                {status === "available" ? (
                  <Button
                    onClick={handleClaim}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-6 rounded-xl font-semibold transition-all duration-200"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Claim This Name
                  </Button>
                ) : (
                  <Button
                    onClick={checkAvailability}
                    disabled={!handle.trim() || status === "checking"}
                    className="bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white px-6 py-6 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "checking" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Check
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Status Messages */}
            <div className="h-8 mt-4">
              {status === "available" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-600 font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  This name is available! Claim it now.
                </motion.p>
              )}
              {status === "taken" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 font-medium"
                >
                  This name is taken. Try another one.
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600">
                🔥
              </span>
              <span>
                <strong className="text-slate-700">{joinedCount}</strong> doctors joined today
              </span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white"
                />
              ))}
              <div className="w-7 h-7 rounded-full bg-[#0099F7] border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                +
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
