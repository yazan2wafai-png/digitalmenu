import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { imageUploadOptions } from './multer.config';

/**
 * POST /upload/image
 * Protected — requires a valid JWT (Bearer token).
 * Accepts multipart/form-data with a field named "file" (jpg/png/webp, max 5MB).
 * Returns: { url: string } — the public URL to access the uploaded image.
 */
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    return this.uploadService.handleImageUpload(file);
  }
}
