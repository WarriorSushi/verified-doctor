"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Users,
  ThumbsUp,
  MessageSquare,
  MousePointer,
  Loader2,
  Send,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AdminLogoutButton } from "@/components/admin/logout-button";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  handle: string;
  specialty: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  is_verified: boolean;
  verification_status: string | null;
  clinic_name: string | null;
  clinic_location: string | null;
  years_experience: number | null;
  recommendation_count: number | null;
  connection_count: number | null;
  created_at: string | null;
}

interface Stats {
  messageCount: number;
  connectionCount: number;
  totalViews: number;
  uniqueViews: number;
  verifiedDoctorViews: number;
  totalActions: number;
}

interface Document {
  id: string;
  document_url: string;
  uploaded_at: string;
}

interface UserData {
  profile: Profile;
  documents: Document[];
  stats: Stats;
}

export default function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim() || !userData) return;

    setSending(true);
    try {
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: userData.profile.id,
          message: message.trim(),
        }),
      });

      if (response.ok) {
        toast.success("Admin message sent successfully!");
        setMessage("");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (profile: Profile) => {
    if (profile.is_verified) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-emerald-500/20 text-emerald-400 rounded-full">
          <CheckCircle2 className="w-4 h-4" />
          Verified
        </span>
      );
    }
    if (profile.verification_status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-amber-500/20 text-amber-400 rounded-full">
          <Clock className="w-4 h-4" />
          Verification Pending
        </span>
      );
    }
    if (profile.verification_status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-red-500/20 text-red-400 rounded-full">
          <XCircle className="w-4 h-4" />
          Verification Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-slate-700 text-slate-400 rounded-full">
        Unverified
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0099F7] animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">User not found</h2>
          <Link href="/admin/users" className="text-[#0099F7] hover:underline">
            Back to users
          </Link>
        </div>
      </div>
    );
  }

  const { profile, stats } = userData;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <div className="relative w-8 h-8">
                <Image
                  src="/verified-doctor-logo.svg"
                  alt="Verified.Doctor"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">Admin Panel</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-[#0099F7]/20 text-[#0099F7] rounded-full">
                Verified.Doctor
              </span>
            </div>
          </div>
          <AdminLogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all users
        </Link>

        {/* Profile Header */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
              {profile.profile_photo_url ? (
                <Image
                  src={profile.profile_photo_url}
                  alt={profile.full_name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-medium">
                  {profile.full_name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
                  <p className="text-slate-400">{profile.specialty || "No specialty"}</p>
                  <a
                    href={`/${profile.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0099F7] hover:underline mt-1"
                  >
                    verified.doctor/{profile.handle}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {getStatusBadge(profile)}
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Clinic</p>
                  <p className="text-white">{profile.clinic_name || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Location</p>
                  <p className="text-white">{profile.clinic_location || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Experience</p>
                  <p className="text-white">
                    {profile.years_experience ? `${profile.years_experience} years` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Joined</p>
                  <p className="text-white">
                    {profile.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
                <p className="text-slate-400 text-sm">Views (30d)</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <ThumbsUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{profile.recommendation_count || 0}</p>
                <p className="text-slate-400 text-sm">Recommendations</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.connectionCount}</p>
                <p className="text-slate-400 text-sm">Connections</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <MousePointer className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalActions}</p>
                <p className="text-slate-400 text-sm">Actions (30d)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Send Admin Message */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-rose-500/20">
              <MessageSquare className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Send Admin Message</h2>
              <p className="text-slate-400 text-sm">
                This message will appear pinned in the user&apos;s inbox with admin styling
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="message" className="text-slate-300">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to this user..."
                rows={4}
                className="mt-1.5 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                Sender will be shown as &quot;Verified.Doctor Team&quot;
              </p>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sending}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Admin Message
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
