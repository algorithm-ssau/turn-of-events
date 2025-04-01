import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron('0 0 12 * * *', { timeZone: 'Europe/Moscow' }) // Каждый день в 12:00 по Москве
  handleCron() {
    console.log('Андрей, проверь финансы...');
  }
}
