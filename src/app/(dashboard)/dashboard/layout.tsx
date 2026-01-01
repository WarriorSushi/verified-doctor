import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { Pencil, ExternalLink } from "lucide-react";
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

          <UserMenu
            fullName={profile.full_name}
            handle={profile.handle}
          />
        </div>

        {/* Navigation - Desktop only */}
        <div className="hidden sm:block">
          <DashboardNav
            unreadCount={unreadCount || 0}
            pendingConnectionsCount={pendingConnectionsCount || 0}
          />
        </div>
      </header>

      {/* Action Bar - Sticky below header */}
      <div className="sticky top-[57px] sm:top-[105px] z-40 bg-gradient-to-r from-[#0099F7] to-[#0080CC] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 sm:gap-4 py-2.5 sm:py-3">
            <Link
              href="/dashboard/profile-builder"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm transition-all border border-white/30"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Public Page</span>
            </Link>
            <Link
              href={`/${profile.handle}`}
              target="_blank"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0080CC] px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Public Page</span>
            </Link>
          </div>
        </div>
      </div>

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
