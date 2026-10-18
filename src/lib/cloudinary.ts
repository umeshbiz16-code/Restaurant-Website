import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(
    cloudName &&
    apiKey &&
    apiSecret &&
    !cloudName.includes('your-cloudinary-cloud-name') &&
    !apiKey.includes('your-cloudinary-api-key')
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  secure_url?: string;
  public_id?: string;
  format?: string;
  width?: number;
  height?: number;
  error?: string;
}

export async function uploadToCloudinary(
  fileBase64OrUrl: string,
  folder: string = 'satvik-caters'
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    console.warn('Cloudinary is not configured with actual API credentials. Upload skipped.');
    return {
      success: false,
      error: 'Cloudinary credentials are not configured in .env yet. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
    };
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileBase64OrUrl, {
      folder,
      resource_type: 'auto',
    });

    return {
      success: true,
      url: uploadResponse.url,
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      format: uploadResponse.format,
      width: uploadResponse.width,
      height: uploadResponse.height,
    };
  } catch (err: any) {
    console.error('Cloudinary upload error:', err);
    return {
      success: false,
      error: err.message || 'Unknown Cloudinary upload error',
    };
  }
}

export function getCloudinaryImageUrl(publicId: string, transformations: string = 'f_auto,q_auto'): string {
  if (!cloudName || cloudName.includes('your-cloudinary')) {
    return `/images/${publicId}`;
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

export default cloudinary;
