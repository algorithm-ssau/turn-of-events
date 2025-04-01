import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Конфигурация для Swagger
  const config = new DocumentBuilder()
    .setTitle('Документация API')
    .setDescription('Описание всех эндпоинтов, их запросов и ответов со всевозможными статус кодами. Включает информацию о статусах и примерах запросов.')

    .setVersion('1.0')
    .build();

  // Создаем документ на основе конфигурации
  const document = SwaggerModule.createDocument(app, config);
  
  // Настраиваем Swagger UI по эндпоинту /api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
