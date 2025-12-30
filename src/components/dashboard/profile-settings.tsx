"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Check, Palette } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerificationUpload } from "./verification-upload";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  handle: string;
  full_name: string;
  specialty: string | null;
  clinic_name: string | null;
  clinic_location: string | null;
  years_experience: number | null;
  profile_photo_url: string | null;
  external_booking_url: string | null;
  is_verified: boolean | null;
  verification_status: string | null;
  profile_template: string | null;
}

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean white with brand blue accents",
    colors: ["#FFFFFF", "#0099F7", "#F8FAFC"],
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Soft blue professional theme",
    colors: ["#F8FCFE", "#0077B6", "#90E0EF"],
  },
  {
    id: "sage",
    name: "Sage",
    description: "Calming green medical aesthetic",
    colors: ["#F9FBF9", "#4A7C59", "#A8D5BA"],
  },
  {
    id: "warm",
    name: "Warm",
    description: "Soft cream with terracotta accents",
    colors: ["#FFFBF7", "#C4784F", "#E8D5C4"],
  },
];

interface ProfileSettingsProps {
  profile: Profile;
}

export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState(profile.full_name);
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [clinicName, setClinicName] = useState(profile.clinic_name || "");
  const [clinicLocation, setClinicLocation] = useState(
    profile.clinic_location || ""
  );
  const [yearsExperience, setYearsExperience] = useState(
    profile.years_experience?.toString() || ""
  );
  const [externalBookingUrl, setExternalBookingUrl] = useState(
    profile.external_booking_url || ""
  );
  const [selectedTemplate, setSelectedTemplate] = useState(
    profile.profile_template || "classic"
  );
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsSavingTemplate(true);
    try {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileTemplate: templateId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update template");
      }

      toast.success("Template updated!");
      router.refresh();
    } catch {
      toast.error("Failed to update template");
      setSelectedTemplate(profile.profile_template || "classic");
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          specialty,
          clinicName: clinicName || null,
          clinicLocation: clinicLocation || null,
          yearsExperience: yearsExperience ? parseInt(yearsExperience) : null,
          externalBookingUrl: externalBookingUrl || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess(true);
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Profile Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="handle">Profile URL</Label>
              <div className="flex items-center h-10 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-500">
                verified.doctor/{profile.handle}
              </div>
              <p className="text-xs text-slate-400">
                Handle cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Cardiologist"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                max="70"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
              <Input
                id="clinicName"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="HeartCare Clinic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicLocation">Location</Label>
              <Input
                id="clinicLocation"
                value={clinicLocation}
                onChange={(e) => setClinicLocation(e.target.value)}
                placeholder="Mumbai, India"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bookingUrl">External Booking URL</Label>
            <Input
              id="bookingUrl"
              type="url"
              value={externalBookingUrl}
              onChange={(e) => setExternalBookingUrl(e.target.value)}
              placeholder="https://practo.com/dr-yourname"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">
              Profile updated successfully!
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-900">
            Profile Theme
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Choose how your public profile looks to visitors
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleTemplateChange(template.id)}
              disabled={isSavingTemplate}
              className={cn(
                "relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-md",
                selectedTemplate === template.id
                  ? "border-[#0099F7] bg-blue-50/50"
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-[#0099F7] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Color preview */}
              <div className="flex gap-1.5 mb-3">
                {template.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <p className="font-medium text-slate-900">{template.name}</p>
              <p className="text-xs text-slate-500">{template.description}</p>
            </button>
          ))}
        </div>

        {isSavingTemplate && (
          <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Saving...
          </p>
        )}
      </div>

      {/* Verification Section */}
      <div
        id="verification"
        className="bg-white rounded-xl border border-slate-200 p-6"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Verification
        </h2>

        <VerificationUpload
          profileId={profile.id}
          currentStatus={profile.verification_status}
          isVerified={profile.is_verified}
        />
      </div>

      {/* Logout */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Account</h2>
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={async () => {
            await fetch("/api/test-auth/logout", { method: "POST" });
            window.location.href = "/";
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
