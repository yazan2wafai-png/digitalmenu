import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStorageProvider } from '../storage.interface';

/**
 * LocalStorageProvider
 * --------------------
 * Stores files on the local filesystem under /uploads.
 * Multer (configured in multer.config.ts) has already written the file to disk
 * by the time this method is called; we only need to return the public URL.
 *
 * SWAP POINT: Replace this provider in StorageModule to use S3 or Cloudinary.
 */
@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  constructor(private readonly config: ConfigService) {}

  async store(file: Express.Multer.File): Promise<string> {
    // Return a relative path rather than guessing an absolute host. On
    // Railway there's no BASE_URL configured, so the old `?? 'http://localhost:3001'`
    // fallback silently produced unreachable URLs in production (e.g. Act Noir's
    // logo). Frontend consumers (LogoPlaceholder, ProductCard) already know how
    // to resolve a relative "/uploads/..." path against NEXT_PUBLIC_API_URL, so
    // this works everywhere without needing a BASE_URL env var at all.
    return `/uploads/${file.filename}`;
  }
}
