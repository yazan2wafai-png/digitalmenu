import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const UPLOADS_DIR = join(process.cwd(), 'uploads');

// Ensure uploads directory exists at startup
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const imageUploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      const uniqueName = randomUUID();
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${uniqueName}${ext}`);
    },
  }),
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
