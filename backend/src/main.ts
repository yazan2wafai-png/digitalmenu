import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serve uploaded images at /uploads/*
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on port ${port}`);

  // Run Prisma migrations and seed after server starts listening on $PORT
  // This guarantees instant HTTP 200 OK responses to Railway health checks
  if (process.env.DATABASE_URL) {
    execAsync('npx prisma migrate deploy && npx prisma db seed')
      .then(({ stdout, stderr }) => {
        if (stdout) console.log('🌱 Production DB Migration & Seed:', stdout);
        if (stderr) console.log('ℹ️ DB Migration & Seed info:', stderr);
      })
      .catch((err) => console.error('⚠️ DB Migration & Seed warning:', err.message || err));
  }
}
bootstrap();
