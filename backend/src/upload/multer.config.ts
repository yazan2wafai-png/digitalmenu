import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Buffer the upload in memory instead of writing straight to local disk.
// The active StorageProvider (local disk or S3/R2) decides where the bytes
// actually end up - see src/storage. Keeping multer disk-agnostic means the
// provider can be swapped without touching this file.
export const imageUploadOptions: MulterOptions = {
  storage: memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Invalid file type "${file.mimetype}". Allowed: jpg, png, webp.`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
};
