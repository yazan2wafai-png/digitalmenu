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
    const baseUrl = this.config.get<string>('BASE_URL') ?? 'http://localhost:3001';
    return `${baseUrl}/uploads/${file.filename}`;
  }
}
