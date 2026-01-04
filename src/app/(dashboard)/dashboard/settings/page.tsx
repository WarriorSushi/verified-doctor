import { redirect } from "next/navigation";
import { getProfile } from "@/lib/profile-cache";
import { ProfileSettings } from "@/components/dashboard/profile-settings";

export default async function SettingsPage() {
  // Use cached profile - deduplicated with layout
  const { profile, userId } = await getProfile();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!profile) {
    redirect("/onboarding");
  }

  // Ensure profile fields have default values (cast needed until DB types are regenerated)
  const profileData = profile as typeof profile & {
    profile_template?: string | null;
    profile_layout?: string | null;
    profile_theme?: string | null;
  };
  const profileWithTemplate = {
    ...profile,
    profile_template: profileData.profile_template ?? "classic",
    profile_layout: profileData.profile_layout ?? "classic",
    profile_theme: profileData.profile_theme ?? "blue",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">
          Manage your profile and account settings
        </p>
      </div>

      <ProfileSettings profile={profileWithTemplate} />
    </div>
  );
}
