import { useState, useCallback } from 'react';
import { imageService } from '../services/imageService';
import { compressImage, formatFileSize } from '../utils/imageCompression';
import toast from 'react-hot-toast';

/**
 * useImageUpload — handles file selection, validation, upload with progress feedback.
 *
 * @param {'BOTTLE'|'CLIENT_LOGO'|'SIERRA_LOGO'} category
 * @param {string} label  — e.g. "500ml", "Taj Hotels", "primary"
 * @param {function} onSuccess — called with the ImageAsset after successful upload
 */
export function useImageUpload(category, label, onSuccess) {
  const [uploading, setUploading]   = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [preview, setPreview]       = useState(null);
  const [asset, setAsset]           = useState(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    // Local preview immediately (before compression)
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Compress image client-side before upload
    setCompressing(true);
    let fileToUpload = file;
    try {
      fileToUpload = await compressImage(file, { maxSizeMB: 1, maxWidthOrHeight: 1280 });
      if (fileToUpload.size < file.size) {
        const saved = Math.round((1 - fileToUpload.size / file.size) * 100);
        toast.success(`Compressed ${formatFileSize(file.size)} → ${formatFileSize(fileToUpload.size)} (${saved}% saved)`);
      }
    } catch {
      fileToUpload = file;
    } finally {
      setCompressing(false);
    }

    setUploading(true);
    try {
      let uploaded;
      if (category === 'BOTTLE')           uploaded = await imageService.uploadBottle(fileToUpload, label);
      else if (category === 'CLIENT_LOGO') uploaded = await imageService.uploadClientLogo(fileToUpload, label);
      else if (category === 'SIERRA_LOGO') uploaded = await imageService.uploadSierraLogo(fileToUpload, label);
      else                                 uploaded = await imageService.upload(fileToUpload, category, label);

      setAsset(uploaded);
      toast.success('Image uploaded successfully!');
      onSuccess?.(uploaded);
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [category, label, onSuccess]);

  const reset = useCallback(() => {
    setPreview(null);
    setAsset(null);
  }, []);

  return { uploading, compressing, preview, asset, handleFile, reset };
}
