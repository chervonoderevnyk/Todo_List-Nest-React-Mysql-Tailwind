import { Module } from '@nestjs/common';

import { TaskListController } from './task-lists.controller';
import { TaskListService } from './task-lists.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
  ],
  controllers: [TaskListController],
  providers: [TaskListService],
  exports: [TaskListService],
})
export class TaskListModule {}
