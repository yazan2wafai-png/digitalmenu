import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';
import { STORAGE_PROVIDER, IStorageProvider } from './storage.interface';

/**
 * StorageModule
 * -------------
 * Provides the active storage backend behind the STORAGE_PROVIDER token.
 *
 * Controlled entirely by the STORAGE_PROVIDER env var:
 *   - "s3" (recommended for production) -> S3StorageProvider (R2/S3/B2 - see
 *     s3-storage.provider.ts for the required env vars). Survives redeploys.
 *   - unset / anything else -> LocalStorageProvider. Fine for local dev, but
 *     files DO NOT survive a redeploy/restart on Railway or similar hosts.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: STORAGE_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService): IStorageProvider => {
        if (config.get<string>('STORAGE_PROVIDER') === 's3') {
          return new S3StorageProvider(config);
        }
        return new LocalStorageProvider();
      },
    },
  ],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
