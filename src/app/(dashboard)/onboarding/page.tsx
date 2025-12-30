"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  Check,
  Upload,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const prefilledHandle = searchParams.get("handle");

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [handle, setHandle] = useState(prefilledHandle || "");
  const [fullName, setFullName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [clinicLocation, setClinicLocation] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [externalBookingUrl, setExternalBookingUrl] = useState("");

  // Check if handle is available
  const [handleStatus, setHandleStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >(prefilledHandle ? "available" : "idle");

  useEffect(() => {
    if (prefilledHandle) {
      setHandle(prefilledHandle);
      setHandleStatus("available");
    }
  }, [prefilledHandle]);

  const checkHandle = async () => {
    if (!handle.trim() || handle.length < 3) return;

    setHandleStatus("checking");
    try {
      const response = await fetch("/api/check-handle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.toLowerCase().trim() }),
      });
      const data = await response.json();
      setHandleStatus(data.available ? "available" : "taken");
    } catch {
      setHandleStatus("idle");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, create a local URL (in production, upload to Supabase Storage)
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: handle.toLowerCase().trim(),
          fullName,
          specialty,
          clinicName: clinicName || undefined,
          clinicLocation: clinicLocation || undefined,
          yearsExperience: yearsExperience ? parseInt(yearsExperience) : undefined,
          profilePhotoUrl: profilePhoto || undefined,
          externalBookingUrl: externalBookingUrl || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create profile");
      }

      // Redirect to dashboard with success message
      router.push(`/dashboard?new=true&handle=${handle}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedStep1 =
    handle.length >= 3 && handleStatus === "available" && fullName.length >= 2;
  const canProceedStep2 = specialty.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0099F7]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#A4FDFF]/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="relative w-10 h-10">
            <Image
              src="/verified-doctor-logo.svg"
              alt="Verified.Doctor"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-semibold text-slate-800 tracking-tight">
            verified<span className="text-[#0099F7]">.doctor</span>
          </span>
        </Link>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-colors ${
                s <= step ? "bg-[#0099F7]" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Let&apos;s set up your profile
                  </h1>
                  <p className="text-slate-600">
                    This takes less than 2 minutes
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Handle */}
                  <div className="space-y-2">
                    <Label htmlFor="handle">Your URL</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center h-12 px-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-slate-500 font-medium">
                          verified.doctor/
                        </span>
                      </div>
                      <div className="flex-1 relative">
                        <Input
                          id="handle"
                          type="text"
                          value={handle}
                          onChange={(e) => {
                            setHandle(
                              e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                            );
                            setHandleStatus("idle");
                          }}
                          onBlur={checkHandle}
                          placeholder="yourname"
                          className="h-12"
                        />
                        {handleStatus === "checking" && (
                          <Loader2 className="absolute right-3 top-3.5 w-5 h-5 animate-spin text-slate-400" />
                        )}
                        {handleStatus === "available" && (
                          <Check className="absolute right-3 top-3.5 w-5 h-5 text-emerald-500" />
                        )}
                        {handleStatus === "taken" && (
                          <X className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    {handleStatus === "taken" && (
                      <p className="text-sm text-red-500">
                        This handle is already taken
                      </p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Arjun Sharma"
                      className="h-12"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="w-full h-12 mt-8 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white font-semibold"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </>
            )}

            {/* Step 2: Professional Info */}
            {step === 2 && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Professional Details
                  </h1>
                  <p className="text-slate-600">
                    Help patients find the right specialist
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Specialty */}
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="e.g. Cardiologist, General Physician, Dermatologist"
                      className="h-12"
                    />
                  </div>

                  {/* Years Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">
                      Years of Experience (optional)
                    </Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      max="70"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      placeholder="e.g. 12"
                      className="h-12"
                    />
                  </div>

                  {/* Clinic Name */}
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Clinic/Hospital Name (optional)</Label>
                    <Input
                      id="clinicName"
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="HeartCare Clinic"
                      className="h-12"
                    />
                  </div>

                  {/* Clinic Location */}
                  <div className="space-y-2">
                    <Label htmlFor="clinicLocation">Location (optional)</Label>
                    <Input
                      id="clinicLocation"
                      type="text"
                      value={clinicLocation}
                      onChange={(e) => setClinicLocation(e.target.value)}
                      placeholder="Mumbai, India"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2}
                    className="flex-1 h-12 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white font-semibold"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Photo & Links */}
            {step === 3 && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">
                    Final touches
                  </h1>
                  <p className="text-slate-600">
                    Add a photo and booking link
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Profile Photo */}
                  <div className="space-y-2">
                    <Label>Profile Photo (optional)</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                        {profilePhoto ? (
                          <Image
                            src={profilePhoto}
                            alt="Profile"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Upload className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label htmlFor="photo-upload">
                          <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            asChild
                          >
                            <span>
                              {profilePhoto ? "Change Photo" : "Upload Photo"}
                            </span>
                          </Button>
                        </label>
                        {profilePhoto && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setProfilePhoto(null)}
                            className="ml-2 text-red-500 hover:text-red-600"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* External Booking URL */}
                  <div className="space-y-2">
                    <Label htmlFor="bookingUrl">
                      Booking Link (optional)
                      <span className="ml-2 text-slate-400 font-normal">
                        Practo, Calendly, etc.
                      </span>
                    </Label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                      <Input
                        id="bookingUrl"
                        type="url"
                        value={externalBookingUrl}
                        onChange={(e) => setExternalBookingUrl(e.target.value)}
                        placeholder="https://practo.com/dr-sharma"
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 h-12"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Publish Profile
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </motion.div>

        {/* Preview */}
        <div className="mt-6 text-center text-sm text-slate-500">
          Your profile will be live at{" "}
          <span className="font-medium text-[#0099F7]">
            verified.doctor/{handle || "yourname"}
          </span>
        </div>
      </div>
    </div>
  );
}
