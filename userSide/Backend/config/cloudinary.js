// Cloudinary v2 SDK — used to delete images from Cloudinary storage
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extract Cloudinary public_id from a secure_url (for destroy API).
 * Example URL → public_id: ellobroh/products/filename
 */
export const getPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
    return null;
  }

  const afterUpload = imageUrl.split("/upload/")[1];
  if (!afterUpload) return null;

  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  return withoutVersion.replace(/\.[^/.]+$/, "");
};

/**
 * Delete an image from Cloudinary by its URL (no-op if not a Cloudinary URL).
 */
export const deleteCloudinaryImage = async (imageUrl) => {
  const publicId = getPublicIdFromUrl(imageUrl);

  if (!publicId) {
    console.log("Skip Cloudinary delete — not a Cloudinary URL:", imageUrl);
    return;
  }

  console.log("Deleting image from Cloudinary, public_id:", publicId);
  await cloudinary.uploader.destroy(publicId);
  console.log("Cloudinary image deleted:", publicId);
};

export default cloudinary;
