"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, UserPlus, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export function InviteProcessor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteCode = searchParams.get("invite");

  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (inviteCode && !processed && !isProcessing) {
      processInvite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode]);

  const processInvite = async () => {
    if (!inviteCode) return;

    setIsProcessing(true);

    try {
      const response = await fetch("/api/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Connection established!", {
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          duration: 5000,
        });
      } else if (data.alreadyConnected) {
        toast.info("You are already connected with this doctor", {
          icon: <UserPlus className="w-5 h-5 text-blue-500" />,
        });
      } else {
        toast.error(data.error || "Failed to process invite", {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
        });
      }
    } catch (error) {
      console.error("Invite processing error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
      setProcessed(true);

      // Remove invite code from URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.delete("invite");
      router.replace(url.pathname, { scroll: false });
    }
  };

  // Show loading indicator while processing
  if (isProcessing) {
    return (
      <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 shadow-xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#0099F7]" />
          <span className="text-slate-700 font-medium">Processing invite...</span>
        </div>
      </div>
    );
  }

  return null;
}
