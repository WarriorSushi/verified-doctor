import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { InviteProcessor } from "@/components/dashboard/invite-processor";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await getAuth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  // Get unread message count
  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profile.id)
    .eq("is_read", false);

  // Get pending connection requests count
  const { count: pendingConnectionsCount } = await supabase
    .from("connections")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", profile.id)
    .eq("status", "pending");

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

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href={`/${profile.handle}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Your Public Profile
            </Link>
            <Link
              href={`/${profile.handle}`}
              target="_blank"
              className="sm:hidden flex items-center justify-center w-9 h-9 bg-gradient-to-r from-[#0099F7] to-[#0080CC] text-white rounded-lg"
              title="View Your Public Profile"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
            <UserMenu
              fullName={profile.full_name}
              handle={profile.handle}
            />
          </div>
        </div>

        {/* Navigation */}
        <DashboardNav
          unreadCount={unreadCount || 0}
          pendingConnectionsCount={pendingConnectionsCount || 0}
        />
      </header>

      {/* Invite Processor - handles invite codes from URL */}
      <Suspense fallback={null}>
        <InviteProcessor />
      </Suspense>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">{children}</main>
    </div>
  );
}
