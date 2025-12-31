"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Loader2,
  Check,
  QrCode,
  UserPlus,
  ArrowRight,
  Copy,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handle = searchParams.get("handle") || "";

  const [emails, setEmails] = useState(["", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [invitesSent, setInvitesSent] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://verified.doctor/${handle}`;

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const validEmails = emails.filter((email) => {
    // Simple email validation
    return email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  });

  const sendInvites = async () => {
    if (validEmails.length === 0) {
      setError("Please enter at least one valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Send invites for each valid email
      const results = await Promise.all(
        validEmails.map((email) =>
          fetch("/api/invites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim() }),
          })
        )
      );

      // Check if all succeeded
      const allSucceeded = results.every((r) => r.ok);

      if (!allSucceeded) {
        throw new Error("Some invites failed to send");
      }

      setInvitesSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invites");
    } finally {
      setIsLoading(false);
    }
  };

  const copyProfileUrl = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Background elements */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#A4FDFF]/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10">
            <Image
              src="/verified-doctor-logo.svg"
              alt="Verified.Doctor"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight">
            verified<span className="text-[#0099F7]">.doctor</span>
          </span>
        </Link>

        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
          {/* Celebration Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-5 sm:px-8 py-6 sm:py-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Check className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Your Profile is Live!
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              Patients can now find you at
            </p>
            <div className="mt-2 inline-flex items-center gap-2 bg-white/20 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2">
              <span className="font-mono text-sm sm:text-base">
                verified.doctor/{handle}
              </span>
              <button onClick={copyProfileUrl} className="p-1 hover:bg-white/20 rounded">
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 sm:p-3 rounded-xl border border-slate-200 shadow-sm">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(profileUrl)}`}
                  alt="QR Code"
                  width={80}
                  height={80}
                  className="sm:w-[100px] sm:h-[100px]"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm sm:text-base mb-1">
                  <QrCode className="w-4 h-4 text-[#0099F7]" />
                  Your QR Code is Ready
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Display this in your clinic for patients to scan and save your contact.
                </p>
              </div>
            </div>
          </div>

          {/* Invite Section */}
          {!invitesSent ? (
            <div className="px-5 sm:px-8 py-5 sm:py-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0099F7] to-[#0080CC] flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800 text-sm sm:text-base">
                    Invite Your Colleagues
                  </h2>
                  <p className="text-xs text-slate-500">
                    Build your professional network
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mb-4">
                Doctors with strong networks get more visibility. Invite colleagues and you&apos;ll automatically be connected!
              </p>

              <div className="space-y-3">
                {emails.map((email, index) => (
                  <div key={index} className="relative">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder={`colleague${index + 1}@hospital.com`}
                      className="h-10 sm:h-11 text-sm sm:text-base pr-8"
                    />
                    {email && (
                      <button
                        onClick={() => updateEmail(index, "")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <p className="mt-3 text-xs sm:text-sm text-red-500">{error}</p>
              )}

              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={sendInvites}
                  disabled={isLoading || validEmails.length === 0}
                  className="flex-1 h-10 sm:h-11 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white font-semibold text-sm sm:text-base"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Send {validEmails.length > 0 ? `${validEmails.length} ` : ""}Invite{validEmails.length !== 1 ? "s" : ""}
                </Button>
                <Button
                  onClick={goToDashboard}
                  variant="outline"
                  className="h-10 sm:h-11 text-sm sm:text-base"
                >
                  Skip for now
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-5 sm:px-8 py-5 sm:py-6 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                Invites Sent!
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                We&apos;ve sent invitations to {validEmails.length} colleague{validEmails.length !== 1 ? "s" : ""}. You&apos;ll be automatically connected when they join.
              </p>
              <Button
                onClick={goToDashboard}
                className="h-10 sm:h-11 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white font-semibold text-sm sm:text-base"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Tip */}
        <p className="mt-6 text-center text-xs sm:text-sm text-slate-500">
          Tip: Complete your verification to get the{" "}
          <span className="text-[#0099F7] font-medium">verified badge</span> on your profile.
        </p>
      </div>
    </div>
  );
}

function SuccessFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0099F7] mx-auto mb-4" />
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}

export default function OnboardingSuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
