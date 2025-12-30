const supabase = require('../config/supabase');

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} bucket - Bucket name (stories, events, profiles, places)
 * @param {string} filename - Filename to save as
 * @param {string} mimetype - File mimetype
 * @returns {Promise<string>} - Public URL of uploaded file
 */
const uploadToSupabase = async (fileBuffer, bucket, filename, mimetype) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, fileBuffer, {
        contentType: mimetype,
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload to Supabase: ${error.message}`);
  }
};

/**
 * Delete file from Supabase Storage
 * @param {string} bucket - Bucket name
 * @param {string} filename - Filename to delete
 */
const deleteFromSupabase = async (bucket, filename) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filename]);

    if (error) throw error;
  } catch (error) {
    console.error('Supabase delete error:', error);
  }
};

/**
 * Generate unique filename
 * @param {string} originalname - Original filename
 * @returns {string} - Unique filename
 */
const generateFilename = (originalname) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const ext = originalname.split('.').pop();
  return `${timestamp}-${random}.${ext}`;
};

module.exports = {
  uploadToSupabase,
  deleteFromSupabase,
  generateFilename
};
