import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { IStorageProvider } from '../storage.interface';

/**
 * S3StorageProvider
 * ------------------
 * Uploads files to any S3-compatible object store (Cloudflare R2, AWS S3,
 * Backblaze B2, ...) and returns a stable public URL.
 *
 * Unlike LocalStorageProvider, this survives redeploys/restarts/crash-loops
 * with zero risk of losing a previously uploaded file - object storage isn't
 * tied to any single running instance's disk.
 *
 * Required env vars (see README/deploy notes):
 *   STORAGE_PROVIDER=s3
 *   S3_ENDPOINT       - e.g. https://<accountid>.r2.cloudflarestorage.com
 *   S3_REGION         - "auto" for R2, an AWS region for real S3
 *   S3_ACCESS_KEY_ID
 *   S3_SECRET_ACCESS_KEY
 *   S3_BUCKET_NAME
 *   S3_PUBLIC_URL     - base URL files are publicly served from
 *                       (R2 public bucket URL or a custom domain), no trailing slash
 */
@Injectable()
export class S3StorageProvider implements IStorageProvider {
  private readonly logger = new Logger(S3StorageProvider.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>('S3_ENDPOINT');
    const region = this.config.get<string>('S3_REGION') || 'auto';
    const accessKeyId = this.config.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('S3_SECRET_ACCESS_KEY');
    this.bucket = this.config.get<string>('S3_BUCKET_NAME') ?? '';
    this.publicUrl = (this.config.get<string>('S3_PUBLIC_URL') ?? '').replace(/\/$/, '');

    if (!endpoint || !accessKeyId || !secretAccessKey || !this.bucket || !this.publicUrl) {
      throw new Error(
        'S3StorageProvider is missing required env vars. Need: S3_ENDPOINT, S3_ACCESS_KEY_ID, ' +
          'S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_PUBLIC_URL (STORAGE_PROVIDER=s3 was set).',
      );
    }

    this.client = new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
      // R2 is S3-compatible but doesn't implement the newer AWS SDK v3
      // "flexible checksums" feature the same way S3 does - leaving it on
      // its default ('WHEN_SUPPORTED') makes R2 reject otherwise-valid
      // requests with a bare "AccessDenied". Forcing path-style addressing
      // avoids virtual-hosted-style DNS/signature quirks against R2 too.
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
      forcePathStyle: true,
    });
  }

  async store(file: Express.Multer.File): Promise<string> {
    const ext = extname(file.originalname).toLowerCase();
    const key = `uploads/${randomUUID()}${ext}`;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (err) {
      this.logger.error(`Failed to upload ${key} to object storage`, err instanceof Error ? err.stack : String(err));
      throw new InternalServerErrorException('Failed to store uploaded file');
    }

    return `${this.publicUrl}/${key}`;
  }
}
