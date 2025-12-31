"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface VerificationUploadProps {
  profileId: string;
  currentStatus: string | null;
  isVerified: boolean | null;
}

interface FilePreview {
  file: File;
  preview: string;
  type: "image" | "pdf";
}

export function VerificationUpload({
  currentStatus,
  isVerified,
}: VerificationUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FilePreview[] = [];
    const maxFiles = 3;
    const currentCount = files.length;
    const availableSlots = maxFiles - currentCount;

    if (availableSlots <= 0) {
      setError("Maximum 3 documents allowed");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (let i = 0; i < Math.min(selectedFiles.length, availableSlots); i++) {
      const file = selectedFiles[i];

      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only JPG, PNG, WebP, and PDF are allowed.`);
        continue;
      }

      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 5MB.`);
        continue;
      }

      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "";

      newFiles.push({
        file,
        preview,
        type: file.type.startsWith("image/") ? "image" : "pdf",
      });
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      setError("");
    }
  }, [files.length]);

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please select at least one document");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      files.forEach((f) => {
        formData.append("documents", f.file);
      });

      const response = await fetch("/api/verification", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(true);
      toast.success("Documents uploaded! Your verification is under review.");
      // Clean up previews
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      setFiles([]);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  // Show verified state
  if (isVerified) {
    return (
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">Your profile is verified</p>
        </div>
        <p className="text-sm text-emerald-600 mt-1 ml-7">
          The verified badge is visible on your public profile.
        </p>
      </div>
    );
  }

  // Show pending state
  if (currentStatus === "pending") {
    return (
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-center gap-2 text-amber-700">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">Verification under review</p>
        </div>
        <p className="text-sm text-amber-600 mt-1 ml-7">
          We&apos;re reviewing your documents. This usually takes 1-2 business days.
        </p>
      </div>
    );
  }

  // Show success state after upload
  if (success) {
    return (
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="flex items-center gap-2 text-emerald-700">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">Documents uploaded successfully!</p>
        </div>
        <p className="text-sm text-emerald-600 mt-1 ml-7">
          Your verification is now under review. This usually takes 1-2 business days.
        </p>
      </div>
    );
  }

  // Show upload form
  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Get your verified badge</p>
            <p className="text-sm text-blue-700 mt-1">
              Upload one or more of the following documents to verify your medical credentials:
            </p>
            <ul className="text-sm text-blue-700 mt-2 list-disc list-inside space-y-1">
              <li>Medical Registration Certificate (MCI/State Medical Council)</li>
              <li>Photo of your ID card with medical registration</li>
              <li>Degree certificate (MBBS, MD, etc.)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? "border-[#0099F7] bg-blue-50"
            : "border-slate-200 hover:border-slate-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <p className="font-medium text-slate-700">
              Drag and drop your documents here
            </p>
            <p className="text-sm text-slate-500 mt-1">
              or{" "}
              <button
                type="button"
                className="text-[#0099F7] hover:underline font-medium"
                onClick={() => fileInputRef.current?.click()}
              >
                browse files
              </button>
            </p>
          </div>
          <p className="text-xs text-slate-400">
            JPG, PNG, WebP, or PDF • Max 5MB each • Up to 3 files
          </p>
        </div>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">
            Selected documents ({files.length}/3)
          </p>
          <div className="grid gap-2">
            {files.map((f, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                {f.type === "image" ? (
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-white border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {f.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(f.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={files.length === 0 || isUploading}
        className="w-full bg-[#0099F7] hover:bg-[#0080CC]"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Submit for Verification
          </>
        )}
      </Button>
    </div>
  );
}
