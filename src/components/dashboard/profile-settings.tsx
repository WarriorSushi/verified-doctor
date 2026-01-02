"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Save, Check, Palette, Power, AlertTriangle, Upload, Camera } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageCropper } from "@/components/ui/image-cropper";
import { VerificationUpload } from "./verification-upload";
import { cn } from "@/lib/utils";
import { uploadProfilePhoto } from "@/lib/upload";
import { getUser } from "@/lib/auth/client";

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
  const [isFrozen, setIsFrozen] = useState(false);
  const [isTogglingFreeze, setIsTogglingFreeze] = useState(false);

  // Photo upload state
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    profile.profile_photo_url
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImageForCrop, setOriginalImageForCrop] = useState<string | null>(null);

  // Fetch freeze status on mount
  useEffect(() => {
    const fetchFreezeStatus = async () => {
      try {
        const response = await fetch("/api/profile/freeze");
        if (response.ok) {
          const data = await response.json();
          setIsFrozen(data.isFrozen);
        }
      } catch {
        // Ignore errors, default to false
      }
    };
    fetchFreezeStatus();
  }, []);

  const handleFreezeToggle = async (checked: boolean) => {
    setIsTogglingFreeze(true);
    try {
      const response = await fetch("/api/profile/freeze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFrozen: checked }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsFrozen(data.isFrozen);
        toast.success(data.message);
        router.refresh();
      } else {
        toast.error("Failed to update profile status");
      }
    } catch {
      toast.error("Failed to update profile status");
    } finally {
      setIsTogglingFreeze(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file and show cropper
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImageForCrop(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setShowCropper(false);
    setIsUploadingPhoto(true);

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(croppedBlob);

      // Get user ID for upload
      const { data: userData } = await getUser();
      if (!userData?.user?.id) {
        throw new Error("Please sign in to upload a photo");
      }

      // Convert Blob to File for upload
      const croppedFile = new File([croppedBlob], "profile-photo.jpg", {
        type: "image/jpeg",
      });

      // Upload to Supabase Storage
      const publicUrl = await uploadProfilePhoto(croppedFile, userData.user.id);

      // Update profile with new photo URL
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePhotoUrl: publicUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile photo");
      }

      toast.success("Profile photo updated!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload photo");
      setProfilePhotoPreview(profile.profile_photo_url);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

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
      {/* Image Cropper Modal */}
      {originalImageForCrop && (
        <ImageCropper
          imageSrc={originalImageForCrop}
          open={showCropper}
          onClose={() => {
            setShowCropper(false);
            setOriginalImageForCrop(null);
          }}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
          cropShape="round"
        />
      )}

      {/* Profile Photo */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-900">
            Profile Photo
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {profilePhotoPreview ? (
              <Image
                src={profilePhotoPreview}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : isUploadingPhoto ? (
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-slate-400" />
            )}
            {isUploadingPhoto && profilePhotoPreview && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm text-slate-600 mb-3">
              Upload a professional photo. It will be compressed automatically.
            </p>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploadingPhoto}
                className="hidden"
                id="photo-upload-settings"
              />
              <label htmlFor="photo-upload-settings">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  disabled={isUploadingPhoto}
                  asChild
                >
                  <span>
                    {isUploadingPhoto ? "Uploading..." : profilePhotoPreview ? "Change Photo" : "Upload Photo"}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>

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

      {/* Profile Visibility (Freeze) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Power className="w-5 h-5 text-slate-500" />
          <h2 className="text-lg font-semibold text-slate-900">
            Profile Visibility
          </h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-slate-900">
                {isFrozen ? "Profile is Offline" : "Profile is Live"}
              </p>
              {isFrozen && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                  Frozen
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {isFrozen
                ? "Your profile is hidden from patients. Turn this off to go live again."
                : "Your profile is visible to patients at verified.doctor/" + profile.handle}
            </p>
          </div>
          <Switch
            checked={isFrozen}
            onCheckedChange={handleFreezeToggle}
            disabled={isTogglingFreeze}
            className={cn(
              isFrozen && "data-[state=checked]:bg-amber-500"
            )}
          />
        </div>

        {isFrozen && (
          <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Your profile is currently frozen
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  While frozen, patients cannot find you, send inquiries, or leave recommendations.
                  You will receive a reminder email to unfreeze your profile.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Account</h2>
        <p className="text-sm text-slate-500 mb-4">
          Sign out of your account on this device.
        </p>
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/";
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
