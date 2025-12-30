"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  is_verified: boolean;
  verification_status: string;
}

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
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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

      {/* Verification Section */}
      <div
        id="verification"
        className="bg-white rounded-xl border border-slate-200 p-6"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Verification
        </h2>

        {profile.is_verified ? (
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-emerald-700 font-medium">
              ✓ Your profile is verified
            </p>
            <p className="text-sm text-emerald-600 mt-1">
              The verified badge is visible on your public profile.
            </p>
          </div>
        ) : profile.verification_status === "pending" ? (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-amber-700 font-medium">
              Verification under review
            </p>
            <p className="text-sm text-amber-600 mt-1">
              We're reviewing your documents. This usually takes 1-2 business
              days.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-700">
                    Get your verified badge
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Upload your medical registration certificate to get the
                    verified badge and build trust with patients.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" disabled>
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents (Coming Soon)
            </Button>
          </div>
        )}
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
