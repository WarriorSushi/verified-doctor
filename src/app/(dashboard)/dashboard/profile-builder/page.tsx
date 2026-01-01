import { redirect } from "next/navigation";
import { getProfile } from "@/lib/profile-cache";
import { ProfileBuilder } from "@/components/dashboard/profile-builder/profile-builder";

export default async function ProfileBuilderPage() {
  const { profile, userId } = await getProfile();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!profile) {
    redirect("/onboarding");
  }

  return <ProfileBuilder profile={profile} />;
}
