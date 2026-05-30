// Multer — middleware for handling multipart/form-data (file uploads)
import multer from "multer";
// Cloudinary storage engine for Multer (uploads files directly to Cloudinary)
import { CloudinaryStorage } from "multer-storage-cloudinary";
// Our pre-configured Cloudinary v2 instance
import cloudinary from "../config/cloudinary.js";

// Allowed image MIME types (checked before upload — not file extension)
const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Max file size: 5 MB in bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Configure Multer to store files on Cloudinary instead of local disk
const storage = new CloudinaryStorage({
  // Pass the Cloudinary SDK instance
  cloudinary,
  // Options for each uploaded file
  params: {
    // Folder path inside your Cloudinary account
    folder: "ellobroh/products",
    // Only image files (not video/raw)
    resource_type: "image",
  },
});

// Validate MIME type before accepting the file
const fileFilter = (req, file, callback) => {
  // Debug: log what Multer received from the client
  console.log("Upload fileFilter — mimetype:", file.mimetype);

  // Reject if mimetype is not in our allowed list
  if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
    // Pass an error to Multer (message shown to client)
    const error = new Error("Only image files are allowed");
    // false = do not accept this file
    return callback(error, false);
  }

  // Accept the file
  callback(null, true);
};

// Create the Multer upload instance with storage, limits, and fileFilter
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

// Base middleware: single file, form field name must be "image"
const singleImageUpload = upload.single("image");

/**
 * Wrapper so we can return friendly errors for file size and validation.
 * Use on POST/PUT product routes before the controller.
 */
export const uploadProductImage = (req, res, next) => {
  // Run Multer for one file in field "image"
  singleImageUpload(req, res, (err) => {
    // Multer-specific errors (e.g. file too large)
    if (err instanceof multer.MulterError) {
      console.log("Multer error code:", err.code);

      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(400);
        return next(new Error("File size must be less than 5MB"));
      }

      res.status(400);
      return next(err);
    }

    // Custom errors from fileFilter (e.g. wrong mimetype)
    if (err) {
      console.log("Upload error:", err.message);
      res.status(400);
      return next(err);
    }

    // File uploaded successfully (or no file sent — both are OK)
    if (req.file) {
      console.log("File uploaded to Cloudinary:", req.file.path);
    } else {
      console.log("No image file in request — will use body URL if provided");
    }

    next();
  });
};

export default uploadProductImage;
