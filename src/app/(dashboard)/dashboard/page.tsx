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
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAuth } from "@/lib/auth/test-auth";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/dashboard/copy-button";
import { formatViewCount } from "@/lib/format-metrics";

export default async function DashboardPage() {
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
    <div className="space-y-8">
      {/* Verification Banner */}
      {!profile.is_verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">
              Your profile is live but unverified
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              Upload your medical credentials to get the verified badge and
              build trust with patients.
            </p>
          </div>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700" asChild>
            <Link href="/dashboard/settings#verification">Get Verified</Link>
          </Button>
        </div>
      )}

      {profile.is_verified && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-emerald-900">
              You are a Verified Physician
            </h3>
            <p className="text-sm text-emerald-700">
              Your verified badge is visible on your public profile.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const content = (
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">
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
      <div className="grid md:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Your QR Code
          </h2>
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://verified.doctor/${profile.handle}`}
                alt="QR Code"
                width={150}
                height={150}
              />
            </div>
            <p className="text-sm text-slate-500 text-center mb-4">
              Display this in your clinic for patients to scan
            </p>
            <Button variant="outline" asChild>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https://verified.doctor/${profile.handle}`}
                download={`qr-${profile.handle}.png`}
                target="_blank"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </a>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/${profile.handle}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Profile
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/settings">
                <Users className="w-4 h-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/messages">
                <MessageSquare className="w-4 h-4 mr-2" />
                View Messages
                {unreadCount ? (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Profile URL */}
      <div className="bg-gradient-to-r from-[#0099F7]/5 to-[#A4FDFF]/10 rounded-xl border border-[#0099F7]/20 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Your Profile URL
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white rounded-lg border border-slate-200 px-4 py-3 font-mono text-sm">
            verified.doctor/{profile.handle}
          </div>
          <CopyButton text={`https://verified.doctor/${profile.handle}`} />
        </div>
      </div>
    </div>
  );
}
