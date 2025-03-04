import { PrismaService } from '../../prisma/prisma.service';
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TaskListMemberGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('Користувач в запиті 7:', request.user);
    const user = request.user;
    const taskListId = parseInt(request.params.id, 10);

    if (!user || !taskListId) {
      throw new ForbiddenException('Недостатньо прав');
    }

    // Перевіряємо, чи користувач є учасником списку
    const membership = await this.prisma.taskListMember.findFirst({
      where: { userId: user.id, taskListId },
    });

    if (!membership) {
      throw new ForbiddenException('Ви не є учасником цього списку');
    }

    return true;
  }
}
