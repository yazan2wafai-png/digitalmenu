import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { IStorageProvider } from '../storage.interface';

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

    const ext = extname(file.originalname).toLowerCase();
    const filename = `${randomUUID()}${ext}`;
    await writeFile(join(UPLOADS_DIR, filename), file.buffer);

    // Relative path: frontend consumers (LogoPlaceholder, ProductCard) resolve
    // this against NEXT_PUBLIC_API_URL, so no BASE_URL env var is needed.
    return `/uploads/${filename}`;
  }
}
