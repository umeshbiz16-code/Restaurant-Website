import { NextResponse } from 'next/server';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, folder = 'satvik-caters' } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Missing image data (must be a base64 string or remote image URL).' },
        { status: 400 }
      );
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          message: 'Cloudinary credentials are not yet configured in .env. Image was received in simulation mode.',
          sampleUrl: '/images/customized_cake.jpg',
        },
        { status: 200 }
      );
    }

    const uploadResult = await uploadToCloudinary(image, folder);

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      configured: true,
      url: uploadResult.secure_url || uploadResult.url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to upload image to Cloudinary.' },
      { status: 500 }
    );
  }
}
