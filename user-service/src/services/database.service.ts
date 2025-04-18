import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    console.log('🚀 Проверка наличия таблиц в БД...');
    
    try {
      const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
      const result = await this.dataSource.query(query);

      if (result.length === 0) {
        console.warn('❌ Таблицы отсутствуют в базе данных!');
      } else {
        console.log('✅ Найдены таблицы:', result.map(row => row.table_name));
      }
    } catch (error) {
      console.error('❗ Ошибка при проверке таблиц:', error);
    }
  }
}
