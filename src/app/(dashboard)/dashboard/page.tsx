import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  ThumbsUp,
  Users,
  MessageSquare,
  QrCode,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile-cache";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/dashboard/copy-button";
import { formatViewCount } from "@/lib/format-metrics";
import { ProfileCompletionBar } from "@/components/dashboard/profile-completion-bar";
import { InviteDialog } from "@/components/dashboard/invite-dialog";
import { InvitePromptCard } from "@/components/dashboard/invite-prompt-card";

export default async function DashboardPage() {
  // Use cached profile - deduplicated with layout
  const { profile, userId } = await getProfile();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!profile) {
    redirect("/onboarding");
  }

  // Get unread count - this is fast since it's a cached connection
  // Layout already fetches this too but caching makes it instant
  const supabase = await createClient();
  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", profile.id)
    .eq("is_read", false);

  const metrics = [
    {
      label: "Profile Views",
      value: profile.view_count || 0,
      icon: Eye,
      format: formatViewCount,
    },
    {
      label: "Recommendations",
      value: profile.recommendation_count || 0,
      icon: ThumbsUp,
    },
    {
      label: "Connections",
      value: profile.connection_count || 0,
      icon: Users,
    },
    {
      label: "Unread Messages",
      value: unreadCount || 0,
      icon: MessageSquare,
      href: "/dashboard/messages",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Verification Banner */}
      {!profile.is_verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 text-sm sm:text-base">
                Your profile is live but unverified
              </h3>
              <p className="text-xs sm:text-sm text-amber-700 mt-1">
                Upload your medical credentials to get the verified badge and
                build trust with patients.
              </p>
            </div>
          </div>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto" asChild>
            <Link href="/dashboard/settings#verification">Get Verified</Link>
          </Button>
        </div>
      )}

      {profile.is_verified && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-emerald-900 text-sm sm:text-base">
              You are a Verified Physician
            </h3>
            <p className="text-xs sm:text-sm text-emerald-700">
              Your verified badge is visible on your public profile.
            </p>
          </div>
        </div>
      )}

      {/* Profile Completion Bar */}
      <ProfileCompletionBar profile={profile} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const content = (
            <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 mb-1 sm:mb-2">
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">{metric.label}</span>
              </div>
              <p className="text-xl sm:text-3xl font-bold text-slate-900">
                {metric.format
                  ? metric.format(metric.value)
                  : metric.value.toLocaleString()}
              </p>
            </div>
          );

          if (metric.href) {
            return (
              <Link key={metric.label} href={metric.href}>
                {content}
              </Link>
            );
          }

          return <div key={metric.label}>{content}</div>;
        })}
      </div>

      {/* QR Code & Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* QR Code */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
            Your QR Code
          </h2>
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 mb-3 sm:mb-4">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://verified.doctor/${profile.handle}`}
                alt="QR Code"
                width={120}
                height={120}
                className="sm:w-[150px] sm:h-[150px]"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 text-center mb-3 sm:mb-4">
              Display this in your clinic for patients to scan
            </p>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://verified.doctor/${profile.handle}`}
                download={`qr-${profile.handle}.png`}
                target="_blank"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Download QR Code
              </a>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <Button size="default" className="w-full justify-center text-sm font-semibold bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] shadow-md hover:shadow-lg transition-all" asChild>
              <Link href={`/${profile.handle}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Your Public Profile
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm" asChild>
              <Link href="/dashboard/settings">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm" asChild>
              <Link href="/dashboard/messages">
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                View Messages
                {unreadCount ? (
                  <span className="ml-auto px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            </Button>
            <InviteDialog
              trigger={
                <Button variant="outline" size="sm" className="w-full justify-start text-xs sm:text-sm">
                  <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Invite Colleague
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Invite Prompt Card - Show if low connections */}
      <InvitePromptCard connectionCount={profile.connection_count || 0} />

      {/* Profile URL */}
      <div className="bg-gradient-to-r from-[#0099F7]/5 to-[#A4FDFF]/10 rounded-xl border border-[#0099F7]/20 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
          Your Profile URL
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div className="flex-1 bg-white rounded-lg border border-slate-200 px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm truncate">
            verified.doctor/{profile.handle}
          </div>
          <CopyButton text={`https://verified.doctor/${profile.handle}`} />
        </div>
      </div>
    </div>
  );
}
