import { Module } from '@nestjs/common';
import { CronService } from './cron.service';

import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [CronService],
})
export class CronModule {}
