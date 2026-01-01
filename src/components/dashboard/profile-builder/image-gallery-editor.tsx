"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, GripVertical, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function ImageGalleryEditor({
  images,
  onChange,
  maxImages = 6,
  profileId,
}: ImageGalleryEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
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

      for (const file of filesToUpload) {
        // Compress image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
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

      onChange([...images, ...uploadedImages]);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
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
    <div className="space-y-4">
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

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                Uploading...
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
      {uploadError && (
        <p className="text-sm text-red-500 text-center">{uploadError}</p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-slate-500 text-center">
        {images.length} of {maxImages} images • Max 500KB each, auto-compressed
      </p>
    </div>
  );
}
