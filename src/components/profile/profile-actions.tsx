"use client";

import { useState } from "react";
import { Download, MessageSquare } from "lucide-react";
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
      `URL:https://verified.doctor/${profile.handle}`,
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

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            onClick={handleSaveContact}
            variant="outline"
            className="flex-1 h-12"
          >
            <Download className="w-4 h-4 mr-2" />
            Save Contact
          </Button>
          <Button
            onClick={() => {
              trackEvent({ profileId: profile.id, eventType: "click_send_inquiry" });
              setIsInquiryOpen(true);
            }}
            className="flex-1 h-12 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Inquiry
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
