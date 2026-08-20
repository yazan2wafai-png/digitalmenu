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

  // Run Prisma db push & seed after server starts listening on $PORT
  if (process.env.DATABASE_URL) {
    execAsync('npx prisma db push --accept-data-loss && npx ts-node prisma/seed.ts && npx ts-node prisma/seed-erenkoy.ts')
      .then(({ stdout, stderr }) => {
        if (stdout) console.log('🌱 Production DB Migration & Seed:', stdout);
        if (stderr) console.log('ℹ️ DB Migration & Seed info:', stderr);
      })
      .catch((err) => console.error('⚠️ DB Migration & Seed warning:', err.message || err));
  }
}
bootstrap();
