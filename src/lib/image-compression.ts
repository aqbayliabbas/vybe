/**
 * Browser-side image compression utility using HTML5 Canvas API.
 * Compresses images client-side to save user bandwidth, Supabase storage space,
 * and speed up website/dashboard loading times.
 */

interface CompressionOptions {
  maxDimension?: number; // Maximum width or height of the compressed image
  quality?: number;      // Compression quality from 0 to 1 (for jpeg/webp)
  mimeType?: string;     // Output format, e.g. 'image/jpeg' or 'image/webp'
}

/**
 * Compresses an image File using Canvas API and returns a Promise with a Blob/File.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<Blob> {
  const {
    maxDimension = 600,
    quality = 0.82,
    mimeType = 'image/jpeg'
  } = options;

  // If the file is not an image, return it as-is
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Only resize if the image exceeds our maxDimension boundary
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        // Draw the image onto the canvas at resized dimensions
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to a Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Image compression resulted in empty canvas'));
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = (err) => reject(new Error('Failed to load image element: ' + err));
    };

    reader.onerror = (err) => reject(new Error('Failed to read file: ' + err));
  });
}
