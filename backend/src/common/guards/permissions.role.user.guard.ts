import { PrismaService } from '../../prisma/prisma.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPayload } from './user.payload';

@Injectable()
export class PermissionsRoleUserGuard implements CanActivate {
  constructor(private prisma: PrismaService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserPayload = request.user;
    const taskId = Number(request.params.id);
    const method = request.method; // Отримуємо HTTP метод (GET, PUT тощо)
    const body = request.body; // Отримуємо тіло запиту (для PUT)

    if (!user) {
      throw new ForbiddenException('Користувач не автентифікований');
    } 

    // Якщо користувач - ADMIN, то дозволяємо все
    if (user.role === 'ADMIN') {
      return true;
    }

    // Отримуємо завдання з БД
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { taskList: { include: { owner: true } } },
    });

    if (!task) {
      throw new NotFoundException(`Завдання з ID ${taskId} не знайдено`);
    }

    // Перевіряємо права доступу для ролі USER
    if (user.role === 'USER') {
      if (method === 'GET') {
        // Користувач з роллю USER може робити GET-запити
        return true;
      }

      if (method === 'PUT') {
        // Користувач з роллю USER може змінювати лише поле `completed`
        if (Object.keys(body).length === 1 && 'completed' in body) {
          return true;
        }
        throw new ForbiddenException('Ви можете змінювати тільки поле `completed`');
      }
      
      // Якщо це інший метод (наприклад, DELETE), забороняємо
      throw new ForbiddenException('Ви не маєте прав виконувати цю дію');
    }

    return false;
  }
}
