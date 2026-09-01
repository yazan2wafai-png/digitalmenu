import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { IStorageProvider, StoredFileStream } from '../storage.interface';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

/**
 * LocalStorageProvider
 * --------------------
 * Stores files on the local filesystem under /uploads and returns a
 * relative "/uploads/<name>" URL.
 *
 * WARNING: on Railway (and most PaaS platforms) local disk is EPHEMERAL -
 * it is wiped on every redeploy/restart unless a Volume is mounted at this
 * exact path. Prefer S3StorageProvider (STORAGE_PROVIDER=s3) for anything
 * that needs to survive a redeploy. This provider is kept as the local-dev
 * default and as a fallback.
 */
@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  async store(file: Express.Multer.File): Promise<string> {
    if (!existsSync(UPLOADS_DIR)) {
      mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const rawExt = file?.originalname ? extname(file.originalname).toLowerCase() : '';
    const ext = rawExt || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    await writeFile(join(UPLOADS_DIR, filename), file.buffer);

    const baseUrl = (process.env.BASE_URL || '').replace(/\/$/, '');
    return baseUrl ? `${baseUrl}/uploads/${filename}` : `/uploads/${filename}`;
  }

  async getFile(key: string): Promise<StoredFileStream | null> {
    const filename = key.replace(/^uploads\//, '').replace(/^\/+/, '');
    const filepath = join(UPLOADS_DIR, filename);
    if (!existsSync(filepath)) return null;
    return {
      body: createReadStream(filepath),
    };
  }
}
