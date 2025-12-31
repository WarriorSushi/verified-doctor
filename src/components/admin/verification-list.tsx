"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
  User,
  Clock,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VerificationDocument {
  id: string;
  document_url: string;
  uploaded_at: string;
}

interface Verification {
  id: string;
  handle: string;
  full_name: string;
  specialty: string | null;
  clinic_name: string | null;
  verification_status: string;
  created_at: string;
  documents: VerificationDocument[];
}

export function AdminVerificationList() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchVerifications = async () => {
    try {
      const response = await fetch("/api/admin/verifications");
      const data = await response.json();

      if (response.ok) {
        setVerifications(data.verifications || []);
      } else {
        toast.error("Failed to load verifications");
      }
    } catch {
      toast.error("Failed to load verifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);

    try {
      const response = await fetch(`/api/admin/verifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        toast.success(
          action === "approve"
            ? "Verification approved!"
            : "Verification rejected"
        );
        // Remove from list
        setVerifications((prev) => prev.filter((v) => v.id !== id));
      } else {
        toast.error(`Failed to ${action} verification`);
      }
    } catch {
      toast.error(`Failed to ${action} verification`);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (verifications.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
        <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          No pending verifications
        </h3>
        <p className="text-slate-400">
          All verification requests have been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {verifications.length} pending request
          {verifications.length !== 1 ? "s" : ""}
        </p>
        <Button
          onClick={fetchVerifications}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white"
        >
          Refresh
        </Button>
      </div>

      {verifications.map((verification) => (
        <div
          key={verification.id}
          className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {verification.full_name}
                  </h3>
                  <p className="text-slate-400">
                    {verification.specialty || "No specialty"} •{" "}
                    {verification.clinic_name || "No clinic"}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      Submitted{" "}
                      {new Date(verification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                href={`/${verification.handle}`}
                target="_blank"
                className="flex items-center gap-1 text-sm text-[#0099F7] hover:underline"
              >
                View Profile
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Documents */}
          <div className="p-6 bg-slate-800/50">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">
                Uploaded Documents ({verification.documents.length})
              </span>
            </div>

            {verification.documents.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {verification.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-[4/3] rounded-lg overflow-hidden border border-slate-600 hover:border-[#0099F7] transition-colors group"
                  >
                    <Image
                      src={doc.document_url}
                      alt="Verification document"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        View Full Size
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No documents uploaded</p>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 bg-slate-900/50 flex items-center justify-end gap-3">
            <Button
              onClick={() => handleAction(verification.id, "reject")}
              disabled={processingId === verification.id}
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              {processingId === verification.id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject
            </Button>
            <Button
              onClick={() => handleAction(verification.id, "approve")}
              disabled={processingId === verification.id}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {processingId === verification.id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Approve
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
