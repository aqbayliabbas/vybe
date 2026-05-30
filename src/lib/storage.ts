import { supabase } from './supabase';

/**
 * Storage Service to handle uploading and deleting brand assets (logos, images, etc.)
 * in the Supabase 'brand-assets' storage bucket.
 */
export const storageService = {
  /**
   * Uploads a compressed brand logo to the 'brand-assets' bucket under a folder
   * named with the user's UUID to satisfy RLS row/folder protection.
   * 
   * @param userId The unique user ID (UUID) of the brand owner
   * @param fileBlob The Blob or File object to upload
   * @returns The public URL of the uploaded image asset
   */
  async uploadBrandLogo(userId: string, fileBlob: Blob | File): Promise<string> {
    const fileExt = 'jpg'; // We save compressed images as jpeg format
    const filePath = `${userId}/logo_${Date.now()}.${fileExt}`;

    // Upload blob to Supabase Storage
    const { data, error } = await supabase.storage
      .from('brand-assets')
      .upload(filePath, fileBlob, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg'
      });

    if (error) {
      console.error('Error uploading brand logo:', error);
      throw error;
    }

    // Retrieve the public URL for the newly uploaded logo
    const { data: urlData } = supabase.storage
      .from('brand-assets')
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to retrieve public URL of the uploaded brand asset');
    }

    return urlData.publicUrl;
  },

  /**
   * Deletes a brand logo from the 'brand-assets' bucket.
   * Parses the file path from the public URL to invoke the deletion API.
   * 
   * @param userId The unique user ID (UUID) of the brand owner
   * @param logoUrl The full public URL of the logo image asset
   */
  async deleteBrandLogo(userId: string, logoUrl: string): Promise<void> {
    if (!logoUrl) return;

    try {
      // Find the asset path inside the brand-assets folder
      // e.g. https://xxxxxx.supabase.co/storage/v1/object/public/brand-assets/USER_ID/logo_123.jpg
      const bucketMarker = 'brand-assets/';
      const idx = logoUrl.indexOf(bucketMarker);
      if (idx === -1) {
        console.warn('URL does not belong to the brand-assets bucket:', logoUrl);
        return;
      }

      const filePath = logoUrl.substring(idx + bucketMarker.length);
      
      // Perform deletion
      const { error } = await supabase.storage
        .from('brand-assets')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting brand logo:', error);
        throw error;
      }
    } catch (err) {
      console.error('Failed to parse or delete brand logo:', err);
      throw err;
    }
  }
};
