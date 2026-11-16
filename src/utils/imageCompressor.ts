export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeBytes?: number;
}

/**
 * Utility to compress images on the client side using HTMLCanvasElement.
 * Reduces raw mobile photos (3MB - 10MB) to lightweight WebP/JPEG data URLs (80KB - 120KB)
 * to prevent localStorage QuotaExceededError while preserving clear visual fidelity for bills/samples.
 * Supports both positional parameters and options object.
 */
export async function compressImage(
  fileOrDataUrl: File | string,
  maxWidthOrOptions: number | CompressImageOptions = 1000,
  maxHeight = 1000,
  quality = 0.72
): Promise<string> {
  let maxWidth = 1000;
  let targetMaxHeight = maxHeight;
  let targetQuality = quality;

  if (typeof maxWidthOrOptions === 'object' && maxWidthOrOptions !== null) {
    maxWidth = maxWidthOrOptions.maxWidth ?? 1000;
    targetMaxHeight = maxWidthOrOptions.maxHeight ?? 1000;
    targetQuality = maxWidthOrOptions.quality ?? 0.72;
  } else if (typeof maxWidthOrOptions === 'number') {
    maxWidth = maxWidthOrOptions;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calculate aspect ratio
      if (width > maxWidth || height > targetMaxHeight) {
        if (width / height > maxWidth / targetMaxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * targetMaxHeight) / height);
          height = targetMaxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
        return;
      }

      // Draw image directly to preserve alpha channel transparency for PNG/WebP
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Prefer image/webp if supported (Full transparency & high compression)
      try {
        const webpData = canvas.toDataURL('image/webp', targetQuality);
        if (webpData.startsWith('data:image/webp')) {
          resolve(webpData);
          return;
        }
      } catch {
        // Fallback to jpeg below
      }

      // Fallback to JPEG if WebP is unsupported
      try {
        const jpegCanvas = document.createElement('canvas');
        jpegCanvas.width = width;
        jpegCanvas.height = height;
        const jctx = jpegCanvas.getContext('2d');
        if (jctx) {
          jctx.fillStyle = '#ffffff';
          jctx.fillRect(0, 0, width, height);
          jctx.drawImage(img, 0, 0, width, height);
          const jpegData = jpegCanvas.toDataURL('image/jpeg', targetQuality);
          resolve(jpegData);
          return;
        }
      } catch {
        // Ignore fallback error
      }

      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
    };

    img.onerror = () => {
      reject(new Error('Không thể tải file ảnh để nén'));
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error('Không thể đọc dữ liệu file'));
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
