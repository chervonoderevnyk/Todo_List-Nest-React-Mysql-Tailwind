import { NestFactory, Reflector } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService); // Отримання екземпляру сервісу `PrismaService` з додатку

  await prismaService.onModuleInit(); // Виклик методу `onModuleInit` для ініціалізації сервісу `PrismaService`

  // Глобальні фільтри
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

   // Налаштування Swagger
   const config = new DocumentBuilder() // Створення нового екземпляру класу `DocumentBuilder`
   .setTitle('My ToDo List API') // Встановлення назви документації(API)
   .setDescription('API for managing task lists') // Встановлення опису документації
   .setVersion('1.0') // Встановлення версії API
   .addTag('task-lists') // Додавання тегу до документації
   .build(); // Побудова об'єкту конфігурації Swagger
 const document = SwaggerModule.createDocument(app, config); // Створення документації Swagger
 SwaggerModule.setup('api/doc', app, document); // Налаштування Swagger для шляху '/api/doc'

 prismaService.enableShutdownHooks(app); // Включення обробника зупинки для сервісу `PrismaService`

  // Логування змінних середовища (для перевірки налаштувань)
  // console.log("DATABASE_URL:", process.env.DATABASE_URL);
  // console.log("JWT_SECRET:", process.env.JWT_SECRET);

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  });

  await app.listen(3002);

}

bootstrap();
