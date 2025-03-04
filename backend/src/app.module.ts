import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/user.module";
import { PrismaService } from "./prisma/prisma.service";
import { TaskModule } from "./tasks/task.module";
import { AuthService } from "./auth/auth.service";
import { TaskListModule } from "./task-lists/task-lists.module";
import { TaskController } from "./tasks/task.controller";
import { UserController } from "./users/user.controller";
import { AuthController } from "./auth/auth.controller";
import { TaskService } from "./tasks/task.service";
import { UserService } from "./users/user.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
    TaskModule,
    TaskListModule,
  ],  
  controllers: [
    TaskController, 
    UserController, 
    AuthController
  ],
  providers: [
    AuthService, 
    PrismaService, 
    TaskService, 
    UserService
  ],
  exports: [AuthService, PrismaService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.prisma.$connect();
      console.log('✅ Підключення до бази даних встановлено!');
    } catch (error) {
      console.error('❌ Помилка підключення до бази даних:', error);
    }
  }
}
