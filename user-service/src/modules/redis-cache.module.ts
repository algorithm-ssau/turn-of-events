import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST, // или 'redis', если имя контейнера
      port: 6379,
      ttl: 30, // Время жизни кэша (секунды)
      // password: '...' // если Redis требует пароль
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
