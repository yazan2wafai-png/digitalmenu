import { Controller, Get } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return { status: 'ok' };
  }

  @Get('setup-db')
  async setupDatabase() {
    try {
      const migrateRes = await execAsync('npx prisma migrate deploy');
      const seedRes = await execAsync('node dist/prisma/seed.js');
      return {
        status: 'success',
        migrate: migrateRes.stdout || migrateRes.stderr,
        seed: seedRes.stdout || seedRes.stderr,
      };
    } catch (err) {
      return {
        status: 'error',
        message: (err as Error).message,
      };
    }
  }
}
