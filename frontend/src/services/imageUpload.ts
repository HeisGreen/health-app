import { supabase } from './supabaseClient';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Validates the image file before upload
 */
const validateImageFile = (file: File): string | null => {
  if (!file) {
    return 'No file selected';
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 5MB limit. Please choose a smaller image.';
  }

  return null;
};

/**
 * Generates a unique filename for the uploaded image
 */
const generateFileName = (userId: string, originalFileName: string): string => {
  const timestamp = Date.now();
  const extension = originalFileName.split('.').pop() || 'jpg';
  return `${userId}-${timestamp}.${extension}`;
};

/**
 * Uploads an image file to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID (email or user ID from backend)
 * @returns Promise with upload result containing URL or error
 */
export const uploadProfilePicture = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  try {
    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    // Generate unique filename
    const fileName = generateFileName(userId, file.name);
    const filePath = `profile-pictures/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image. Please try again.',
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return {
        success: false,
        error: 'Failed to get image URL. Please try again.',
      };
    }

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error: any) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during upload.',
    };
  }
};

/**
 * Deletes an image from Supabase Storage
 * @param filePath - The path of the file to delete (relative to bucket)
 * @returns Promise with deletion result
 */
export const deleteProfilePicture = async (
  filePath: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extract filename from URL if full URL is provided
    const path = filePath.includes('profile-pictures/')
      ? filePath.split('profile-pictures/')[1]
      : filePath;

    const { error } = await supabase.storage
      .from('profile-pictures')
      .remove([path]);

    if (error) {
      console.error('Supabase delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete image.',
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Image delete error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred during deletion.',
    };
  }
};

