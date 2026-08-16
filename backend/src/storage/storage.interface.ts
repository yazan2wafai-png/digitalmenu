/**
 * IStorageProvider — abstraction over file storage backends.
 *
 * To swap LocalStorageProvider for S3 or Cloudinary:
 *   1. Create a new class implementing this interface.
 *   2. Replace the provider in StorageModule — no other file changes needed.
 */
export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

export interface IStorageProvider {
  /**
   * Persists the uploaded file and returns the public URL to access it.
   */
  store(file: Express.Multer.File): Promise<string>;
}
