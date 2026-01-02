"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, GripVertical, Loader2, ImageIcon, CheckCircle2, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";

interface GalleryImage {
  url: string;
  caption?: string;
}

interface ImageGalleryEditorProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  maxImages?: number;
  profileId: string;
}

type UploadStage = "idle" | "compressing" | "uploading" | "success" | "error";

interface UploadProgress {
  stage: UploadStage;
  currentFile: number;
  totalFiles: number;
  fileName: string;
  compressionProgress?: number;
}

export function ImageGalleryEditor({
  images,
  onChange,
  maxImages = 6,
  profileId,
}: ImageGalleryEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (filesToUpload.length === 0) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedImages: GalleryImage[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];

        // Stage 1: Compressing
        setUploadProgress({
          stage: "compressing",
          currentFile: i + 1,
          totalFiles: filesToUpload.length,
          fileName: file.name,
        });

        // Compress image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
          onProgress: (progress) => {
            setUploadProgress(prev => prev ? { ...prev, compressionProgress: progress } : null);
          },
        });

        // Stage 2: Uploading
        setUploadProgress({
          stage: "uploading",
          currentFile: i + 1,
          totalFiles: filesToUpload.length,
          fileName: file.name,
        });

        // Upload to API
        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("profileId", profileId);
        formData.append("type", "gallery");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        uploadedImages.push({ url: data.url });
      }

      // Stage 3: Success
      setUploadProgress({
        stage: "success",
        currentFile: filesToUpload.length,
        totalFiles: filesToUpload.length,
        fileName: "",
      });

      // Brief delay to show success state
      await new Promise(resolve => setTimeout(resolve, 1000));

      onChange([...images, ...uploadedImages]);
      setUploadProgress(null);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress({
        stage: "error",
        currentFile: 0,
        totalFiles: 0,
        fileName: "",
      });
      setUploadError("Failed to upload image. Please try again.");

      // Clear error state after delay
      setTimeout(() => setUploadProgress(null), 2000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  return (
    <div className="space-y-4 relative">
      {/* Upload Progress Overlay */}
      <AnimatePresence>
        {uploadProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4"
            >
              {/* Icon */}
              <div className="flex justify-center">
                {uploadProgress.stage === "compressing" && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-100 to-blue-100 flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-sky-500" />
                  </motion.div>
                )}
                {uploadProgress.stage === "uploading" && (
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center"
                  >
                    <Upload className="w-8 h-8 text-blue-500" />
                  </motion.div>
                )}
                {uploadProgress.stage === "success" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                )}
                {uploadProgress.stage === "error" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-rose-100 flex items-center justify-center"
                  >
                    <X className="w-8 h-8 text-red-500" />
                  </motion.div>
                )}
              </div>

              {/* Status Text */}
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-slate-900">
                  {uploadProgress.stage === "compressing" && "Optimizing Image..."}
                  {uploadProgress.stage === "uploading" && "Uploading..."}
                  {uploadProgress.stage === "success" && "Upload Complete!"}
                  {uploadProgress.stage === "error" && "Upload Failed"}
                </h3>
                <p className="text-sm text-slate-500">
                  {uploadProgress.stage === "compressing" && (
                    <>Compressing for faster loading</>
                  )}
                  {uploadProgress.stage === "uploading" && (
                    <>Saving to your gallery</>
                  )}
                  {uploadProgress.stage === "success" && (
                    <>Your image has been added</>
                  )}
                  {uploadProgress.stage === "error" && (
                    <>Please try again</>
                  )}
                </p>
              </div>

              {/* Progress Bar */}
              {(uploadProgress.stage === "compressing" || uploadProgress.stage === "uploading") && (
                <div className="space-y-2">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        uploadProgress.stage === "compressing"
                          ? "bg-gradient-to-r from-sky-400 to-blue-500"
                          : "bg-gradient-to-r from-blue-400 to-indigo-500"
                      }`}
                      initial={{ width: "0%" }}
                      animate={{
                        width: uploadProgress.stage === "compressing"
                          ? `${uploadProgress.compressionProgress || 0}%`
                          : "100%"
                      }}
                      transition={{
                        duration: uploadProgress.stage === "uploading" ? 2 : 0.3,
                        ease: uploadProgress.stage === "uploading" ? "linear" : "easeOut"
                      }}
                    />
                  </div>
                  {uploadProgress.totalFiles > 1 && (
                    <p className="text-xs text-slate-400 text-center">
                      Image {uploadProgress.currentFile} of {uploadProgress.totalFiles}
                    </p>
                  )}
                </div>
              )}

              {/* File Name */}
              {uploadProgress.fileName && (
                <p className="text-xs text-slate-400 text-center truncate px-4">
                  {uploadProgress.fileName}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
            >
              <Image
                src={image.url}
                alt={image.caption || `Gallery image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Overlay with actions - always visible on mobile */}
              <div className="absolute inset-0 bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors cursor-grab"
                >
                  <GripVertical className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Image number badge */}
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] font-medium text-white">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No images uploaded yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Show off your clinic, waiting area, or equipment
          </p>
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Images
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {uploadError && !uploadProgress && (
        <p className="text-sm text-red-500 text-center">{uploadError}</p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-slate-500 text-center">
        {images.length} of {maxImages} images • Max 500KB each, auto-compressed
      </p>
    </div>
  );
}
