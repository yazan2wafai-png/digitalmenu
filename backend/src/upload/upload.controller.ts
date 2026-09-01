import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { imageUploadOptions } from './multer.config';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Public file proxy stream — streams image from Cloudflare R2 or local disk
   * without depending on ISP-blocked *.r2.dev domains.
   */
  @Get('upload/file/*')
  async serveFile(@Req() req: Request, @Res() res: Response) {
    const rawKey = req.url.split('upload/file/')[1] || '';
    const key = decodeURIComponent(rawKey.split('?')[0]).replace(/^\/+/, '');
    const file = await this.uploadService.getFile(key.startsWith('uploads/') ? key : `uploads/${key}`);
    if (!file) {
      return res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (file.contentType) {
      res.setHeader('Content-Type', file.contentType);
    }
    return (file.body as any).pipe(res);
  }

  @Get('uploads/*')
  async serveUploadsFile(@Req() req: Request, @Res() res: Response) {
    const rawKey = req.url.split('uploads/')[1] || '';
    const key = decodeURIComponent(rawKey.split('?')[0]).replace(/^\/+/, '');
    const file = await this.uploadService.getFile(`uploads/${key}`);
    if (!file) {
      return res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (file.contentType) {
      res.setHeader('Content-Type', file.contentType);
    }
    return (file.body as any).pipe(res);
  }

  /**
   * POST /upload/image
   * Protected — requires a valid JWT (Bearer token).
   * Accepts multipart/form-data with a field named "file" (jpg/png/webp, max 5MB).
   * Returns: { url: string } — the public URL to access the uploaded image.
   */
  @UseGuards(JwtAuthGuard)
  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    return this.uploadService.handleImageUpload(file);
  }
}
