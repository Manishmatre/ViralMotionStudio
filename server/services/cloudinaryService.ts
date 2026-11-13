import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fs from "node:fs";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "deekt4ncx";
const apiKey = process.env.CLOUDINARY_API_KEY || "338921665685543";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "YaC6R_YN8PghLGY2pK4phK3Gj5A";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export async function uploadMediaToCloudinary(
  localFilePath: string,
  options: {
    folder?: string;
    resourceType?: "image" | "video" | "auto" | "raw";
    publicId?: string;
  } = {},
): Promise<{
  success: boolean;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  format?: string;
  bytes?: number;
  error?: string;
}> {
  if (!fs.existsSync(localFilePath)) {
    return { success: false, error: `File not found: ${localFilePath}` };
  }

  try {
    const res: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, {
      folder: options.folder || "viralmotionstudio",
      resource_type: options.resourceType || "auto",
      public_id: options.publicId,
      overwrite: true,
    });

    return {
      success: true,
      url: res.url,
      secureUrl: res.secure_url,
      publicId: res.public_id,
      format: res.format,
      bytes: res.bytes,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Cloudinary Upload Error]:", msg);
    return { success: false, error: msg };
  }
}

export async function getCloudinaryStatus(): Promise<{
  connected: boolean;
  cloudName: string;
  error: string | null;
}> {
  try {
    const res = await cloudinary.api.ping();
    return {
      connected: res.status === "ok",
      cloudName,
      error: null,
    };
  } catch (err: unknown) {
    return {
      connected: false,
      cloudName,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

