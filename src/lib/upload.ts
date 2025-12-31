import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5, // 500KB
  maxWidthOrHeight: 1200,
  useWebWorker: true,
  fileType: "image/jpeg" as const,
};

/**
 * Compresses and uploads a profile photo to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user ID for naming the file
 * @returns The public URL of the uploaded image
 */
export async function uploadProfilePhoto(
  file: File,
  userId: string
): Promise<string> {
  // 1. Compress the image
  const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);

  // 2. Generate unique filename
  const timestamp = Date.now();
  const filename = `${userId}-${timestamp}.jpg`;

  // 3. Upload to Supabase Storage
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("profile-photos")
    .upload(filename, compressedFile, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // 4. Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-photos").getPublicUrl(data.path);

  return publicUrl;
}
