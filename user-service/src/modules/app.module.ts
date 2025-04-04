import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { AppController } from 'src/controllers/app.controller';
import { AppService } from 'src/services/app.service';
import { DatabaseService } from 'src/services/database.service';
import { User } from 'src/entities/user.entity';
import { AuthModule } from './auth.module';
import { RedisCacheModule } from './redis-cache.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../entities/*.entity.{ts,js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    RedisCacheModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
