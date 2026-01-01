import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile-cache";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { InviteProcessor } from "@/components/dashboard/invite-processor";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use cached profile fetch - deduplicated across layout and pages
  const { profile, userId } = await getProfile();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!profile) {
    redirect("/onboarding");
  }

  // Run badge count queries in parallel for performance
  const supabase = await createClient();
  const [unreadResult, pendingResult] = await Promise.all([
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profile.id)
      .eq("is_read", false),
    supabase
      .from("connections")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", profile.id)
      .eq("status", "pending"),
  ]);

  const unreadCount = unreadResult.count;
  const pendingConnectionsCount = pendingResult.count;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
              <Image
                src="/verified-doctor-logo.svg"
                alt="Verified.Doctor"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
              verified<span className="text-[#0099F7]">.doctor</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop: View Profile + Edit Profile buttons */}
            <Link
              href={`/${profile.handle}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Profile
            </Link>
            <Link
              href="/dashboard/profile-builder"
              className="hidden sm:inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-all"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Link>

            {/* Mobile: Two compact pill buttons */}
            <Link
              href={`/${profile.handle}`}
              target="_blank"
              className="sm:hidden group relative flex items-center gap-1 bg-gradient-to-r from-[#0099F7] to-[#0080CC] text-white pl-2 pr-2.5 py-1.5 rounded-full font-medium text-[10px] shadow-md shadow-[#0099F7]/25 active:scale-[0.98] transition-all"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-60" />
              <span className="relative flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="tracking-wide">View</span>
              </span>
            </Link>
            <Link
              href="/dashboard/profile-builder"
              className="sm:hidden flex items-center gap-1 bg-white border border-slate-200 text-slate-600 pl-2 pr-2.5 py-1.5 rounded-full font-medium text-[10px] active:scale-[0.98] transition-all"
            >
              <Pencil className="w-3 h-3" />
              <span className="tracking-wide">Edit</span>
            </Link>

            <UserMenu
              fullName={profile.full_name}
              handle={profile.handle}
            />
          </div>
        </div>

        {/* Navigation - Desktop only */}
        <div className="hidden sm:block">
          <DashboardNav
            unreadCount={unreadCount || 0}
            pendingConnectionsCount={pendingConnectionsCount || 0}
          />
        </div>
      </header>

      {/* Invite Processor - handles invite codes from URL */}
      <Suspense fallback={null}>
        <InviteProcessor />
      </Suspense>

      {/* Main Content - Extra padding on mobile for bottom nav */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-24 sm:pb-8">{children}</main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        unreadCount={unreadCount || 0}
        pendingConnectionsCount={pendingConnectionsCount || 0}
      />
    </div>
  );
}
