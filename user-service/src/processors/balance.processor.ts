import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('balance-update')
export class BalanceProcessor {
  @Process()
  async updateBalance(job: Job<{ userId: number; amount: number }>) {
    const { userId, amount } = job.data;
    console.log(`Обновляем баланс пользователя ${userId} на сумму ${amount}`);

    // Здесь можно добавить обновление баланса в БД
  }
}
