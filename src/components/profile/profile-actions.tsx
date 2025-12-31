"use client";

import { useState } from "react";
import { Download, MessageSquare, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SendInquiryDialog } from "./send-inquiry-dialog";
import { trackEvent } from "@/lib/analytics";

interface Profile {
  id: string;
  full_name: string;
  specialty: string | null;
  clinic_name: string | null;
  clinic_location: string | null;
  external_booking_url: string | null;
  handle: string;
}

interface ProfileActionsProps {
  profile: Profile;
}

export function ProfileActions({ profile }: ProfileActionsProps) {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = `https://verified.doctor/${profile.handle}`;

  const handleSaveContact = () => {
    // Track analytics event
    trackEvent({ profileId: profile.id, eventType: "click_save_contact" });

    // Generate vCard
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.full_name}`,
      profile.specialty ? `TITLE:${profile.specialty}` : "",
      profile.clinic_name ? `ORG:${profile.clinic_name}` : "",
      profile.clinic_location ? `ADR:;;${profile.clinic_location};;;` : "",
      `URL:${profileUrl}`,
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.full_name.replace(/\s+/g, "_")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Contact saved to your device!");
  };

  const handleShare = async () => {
    // Track analytics event
    trackEvent({ profileId: profile.id, eventType: "click_share" });

    const shareData = {
      title: `${profile.full_name} | Verified.Doctor`,
      text: profile.specialty
        ? `Check out ${profile.full_name}, ${profile.specialty} on Verified.Doctor`
        : `Check out ${profile.full_name} on Verified.Doctor`,
      url: profileUrl,
    };

    // Check if Web Share API is available (mainly mobile)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== "AbortError") {
          // Fallback to copy
          await copyToClipboard();
        }
      }
    } else {
      // Fallback to copy link for desktop
      await copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Profile link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-lg mx-auto flex gap-2 sm:gap-3">
          <Button
            onClick={handleSaveContact}
            variant="outline"
            className="flex-1 h-12 px-2 sm:px-4"
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Save Contact</span>
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="h-12 px-3 sm:px-4"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline sm:ml-2">Share</span>
          </Button>
          <Button
            onClick={() => {
              trackEvent({ profileId: profile.id, eventType: "click_send_inquiry" });
              setIsInquiryOpen(true);
            }}
            className="flex-1 h-12 px-2 sm:px-4 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white"
          >
            <MessageSquare className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Send Inquiry</span>
          </Button>
        </div>
      </div>

      <SendInquiryDialog
        open={isInquiryOpen}
        onOpenChange={setIsInquiryOpen}
        profileId={profile.id}
        doctorName={profile.full_name}
      />
    </>
  );
}
