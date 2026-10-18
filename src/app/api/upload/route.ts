import { NextResponse } from 'next/server';
import { uploadToCloudinary, isCloudinaryConfigured } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let imageData: string | null = null;
    let folder = 'satvik_dishes';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = (formData.get('file') || formData.get('image')) as File | null;
      const folderField = formData.get('folder') as string | null;
      if (folderField) folder = folderField;

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = file.type || 'image/jpeg';
        imageData = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }
    } else {
      const body = await req.json();
      imageData = body.file || body.image || body.data || body.photo || null;
      if (body.folder) folder = body.folder;
    }

    if (!imageData) {
      return NextResponse.json(
        { error: 'Missing image data. Please select a valid photo to upload.' },
        { status: 400 }
      );
    }

    // Attempt upload to Cloudinary
    if (isCloudinaryConfigured()) {
      const uploadResult = await uploadToCloudinary(imageData, folder);
      if (uploadResult.success && (uploadResult.secure_url || uploadResult.url)) {
        return NextResponse.json({
          success: true,
          configured: true,
          url: uploadResult.secure_url || uploadResult.url,
          publicId: uploadResult.public_id,
        });
      }
      console.warn('Cloudinary upload warning:', uploadResult.error);
    }

    // Graceful fallback if Cloudinary credentials fail: keep base64 image data URI
    return NextResponse.json({
      success: true,
      configured: false,
      url: imageData,
      fallback: true,
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to upload image.' },
      { status: 500 }
    );
  }
}
