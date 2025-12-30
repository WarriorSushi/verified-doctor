"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Users,
  ExternalLink,
  Check,
  X,
  Loader2,
  UserPlus,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InviteDialog } from "./invite-dialog";

interface Profile {
  id: string;
  full_name: string;
  handle: string;
  specialty: string | null;
  profile_photo_url: string | null;
  is_verified: boolean | null;
}

interface Connection {
  id: string;
  connectedAt: string | null;
  profile: Profile;
}

interface PendingRequest {
  id: string;
  created_at: string | null;
  requester: Profile;
}

interface ConnectionsListProps {
  connections: Connection[];
  pendingRequests: PendingRequest[];
}

export function ConnectionsList({
  connections,
  pendingRequests,
}: ConnectionsListProps) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleRequest = async (id: string, action: "accept" | "reject") => {
    setProcessingId(id);
    try {
      const response = await fetch(`/api/connections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        toast.success(
          action === "accept"
            ? "Connection accepted! You are now connected."
            : "Connection request declined."
        );
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to process request");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process request");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Pending Requests
            <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
              {pendingRequests.length}
            </span>
          </h2>

          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
              >
                <div className="relative w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                  {request.requester.profile_photo_url ? (
                    <Image
                      src={request.requester.profile_photo_url}
                      alt={request.requester.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-semibold">
                      {request.requester.full_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 truncate">
                      {request.requester.full_name}
                    </p>
                    {request.requester.is_verified && (
                      <BadgeCheck className="w-4 h-4 text-[#0099F7]" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate">
                    {request.requester.specialty || "Medical Professional"}
                  </p>
                  {request.created_at && (
                    <p className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(request.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequest(request.id, "reject")}
                    disabled={processingId === request.id}
                  >
                    {processingId === request.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRequest(request.id, "accept")}
                    disabled={processingId === request.id}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {processingId === request.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connections */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Connections
            <span className="ml-2 text-sm font-normal text-slate-500">
              ({connections.length})
            </span>
          </h2>
          <InviteDialog />
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-2">
              No connections yet
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Invite colleagues to grow your professional network
            </p>
            <InviteDialog
              trigger={
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Your First Colleague
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((connection) => (
              <Link
                key={connection.id}
                href={`/${connection.profile.handle}`}
                target="_blank"
                className="group flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="relative w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                  {connection.profile.profile_photo_url ? (
                    <Image
                      src={connection.profile.profile_photo_url}
                      alt={connection.profile.full_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-semibold">
                      {connection.profile.full_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 truncate">
                      {connection.profile.full_name}
                    </p>
                    {connection.profile.is_verified && (
                      <BadgeCheck className="w-4 h-4 text-[#0099F7]" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate">
                    {connection.profile.specialty || "Medical Professional"}
                  </p>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
