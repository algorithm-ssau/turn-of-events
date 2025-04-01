import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BalanceProcessor } from 'src/processors/balance.processor';
import { CronService } from 'src/services/cron.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'balance-update', // Название очереди
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [BalanceProcessor, CronService],
})
export class QueueModule {}
