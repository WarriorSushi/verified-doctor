"use client";

import { useState, useCallback } from "react";
import { Loader2, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ValidatedInput, validationRules } from "@/components/ui/validated-input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";

interface SendInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string;
  doctorName: string;
}

export function SendInquiryDialog({
  open,
  onOpenChange,
  profileId,
  doctorName,
}: SendInquiryDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [formValid, setFormValid] = useState({ name: false, phone: false, email: true });

  const updateFieldValidity = useCallback((field: keyof typeof formValid, isValid: boolean) => {
    setFormValid(prev => ({ ...prev, [field]: isValid }));
  }, []);

  const isFormValid = formValid.name && formValid.phone && formValid.email && message.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          senderName: name,
          senderPhone: phone,
          senderEmail: email || undefined,
          messageContent: message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Track successful inquiry
      trackEvent({ profileId, eventType: "inquiry_sent" });
      setStatus("success");
      toast.success("Message sent successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setStatus("error");
      toast.error(message);
    }
  };

  const handleClose = () => {
    if (status === "success") {
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setStatus("idle");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Inquiry to {doctorName.split(" ")[0]}</DialogTitle>
          <DialogDescription>
            {status === "success"
              ? "Your message has been sent!"
              : `${doctorName} typically responds within 24-48 hours.`}
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-slate-600">
              Your message has been sent. The doctor will contact you via phone or email.
            </p>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <ValidatedInput
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                rules={[
                  validationRules.required("Please enter your name"),
                  validationRules.minLength(2, "Name must be at least 2 characters"),
                ]}
                onValidationChange={(isValid) => updateFieldValidity("name", isValid)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <ValidatedInput
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                rules={[
                  validationRules.required("Please enter your phone number"),
                  validationRules.phone("Please enter a valid phone number"),
                ]}
                onValidationChange={(isValid) => updateFieldValidity("phone", isValid)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <ValidatedInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                rules={[
                  validationRules.email("Please enter a valid email address"),
                ]}
                onValidationChange={(isValid) => updateFieldValidity("email", isValid)}
              />
              <p className="text-xs text-slate-500">
                Doctor may contact you via phone or email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi Doctor, I would like to schedule a consultation..."
                rows={4}
                maxLength={500}
                required
              />
              <p className="text-xs text-slate-500 text-right">
                {message.length}/500 characters
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={status === "loading" || !isFormValid}
                className="flex-1 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
