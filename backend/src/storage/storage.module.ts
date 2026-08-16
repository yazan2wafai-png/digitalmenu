import { Global, Module } from '@nestjs/common';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { STORAGE_PROVIDER } from './storage.interface';

/**
 * StorageModule
 * -------------
 * Provides the active storage backend behind the STORAGE_PROVIDER token.
 *
 * To switch to S3 or Cloudinary:
 *   - Import your new provider class here
 *   - Replace LocalStorageProvider with it in the useClass field below
 *   - No other files need to change
 */
@Global()
@Module({
  providers: [
    {
      provide: STORAGE_PROVIDER,
      useClass: LocalStorageProvider,
    },
  ],
  exports: [STORAGE_PROVIDER],
})
export class StorageModule {}
