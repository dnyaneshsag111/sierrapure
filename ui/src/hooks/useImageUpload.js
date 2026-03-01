import { useState, useCallback } from 'react';
import { imageService } from '../services/imageService';
import toast from 'react-hot-toast';

/**
 * useImageUpload — handles file selection, validation, upload with progress feedback.
 *
 * @param {'BOTTLE'|'CLIENT_LOGO'|'SIERRA_LOGO'} category
 * @param {string} label  — e.g. "500ml", "Taj Hotels", "primary"
 * @param {function} onSuccess — called with the ImageAsset after successful upload
 */
export function useImageUpload(category, label, onSuccess) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]     = useState(null);
  const [asset, setAsset]         = useState(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      let uploaded;
      if (category === 'BOTTLE')       uploaded = await imageService.uploadBottle(file, label);
      else if (category === 'CLIENT_LOGO') uploaded = await imageService.uploadClientLogo(file, label);
      else if (category === 'SIERRA_LOGO') uploaded = await imageService.uploadSierraLogo(file, label);
      else uploaded = await imageService.upload(file, category, label);

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

  return { uploading, preview, asset, handleFile, reset };
}
