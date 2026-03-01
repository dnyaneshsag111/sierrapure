/**
 * Compress an image File before upload using browser-image-compression.
 * Falls back to the original file if compression fails or the library is unavailable.
 *
 * @param {File} file - original image file
 * @param {{ maxSizeMB?: number, maxWidthOrHeight?: number }} options
 * @returns {Promise<File>}
 */
export async function compressImage(file, options = {}) {
  if (!file || !file.type.startsWith('image/')) return file;

  // Skip compression for SVG (vector, no benefit)
  if (file.type === 'image/svg+xml') return file;

  const {
    maxSizeMB       = 1,
    maxWidthOrHeight = 1280,
    useWebWorker    = true,
    onProgress,
  } = options;

  try {
    const imageCompression = (await import('browser-image-compression')).default;
    const compressed = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
      onProgress,
      fileType: file.type,
    });
    // Preserve original filename
    return new File([compressed], file.name, { type: compressed.type });
  } catch (err) {
    console.warn('[compressImage] Compression failed, using original:', err.message);
    return file;
  }
}

/**
 * Returns a human-readable file size string.
 * @param {number} bytes
 */
export function formatFileSize(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
