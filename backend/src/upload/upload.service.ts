import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { STORAGE_PROVIDER } from '../storage/storage.interface';
import type { IStorageProvider, StoredFileStream } from '../storage/storage.interface';

@Injectable()
export class UploadService {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storage: IStorageProvider,
  ) {}

  async handleImageUpload(file: Express.Multer.File | undefined): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided. Send a multipart/form-data request with field name "file".');
    }
    const url = await this.storage.store(file);
    return { url };
  }

  async getFile(key: string): Promise<StoredFileStream | null> {
    if (this.storage.getFile) {
      return this.storage.getFile(key);
    }
    return null;
  }
}
