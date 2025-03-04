import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLE_KEY } from "../decorators/roles.decorator";
import { PrismaService } from "../../prisma/prisma.service";
import { UserPayload } from "./user.payload";
import { UserRoleEnum } from "../enums/user.role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
  
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw new ForbiddenException("Unauthorized");
    }
  
    const user = request.user as UserPayload;
  
    if (!user.role) {
      throw new ForbiddenException("Unauthorized");
    }
    
    // ADMIN має повний доступ
    if (user.role === UserRoleEnum.ADMIN) {
      return true;
    }
  
    if (request.method === "POST") {
      return requiredRoles?.length ? requiredRoles.includes(user.role) : false;
    }    
  
    const taskId = request.params.id ? parseInt(request.params.id, 10) : null;
    if (!taskId) {
      throw new ForbiddenException("Task ID is required");
    }
  
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { taskList: { include: { members: true } } },
    });
  
    if (!task) {
      throw new ForbiddenException("Task not found");
    }
  
    // const isMember = task.taskList.members.some((member) => member.userId.toString() === user.id);
    // if (!isMember) {
    //   throw new ForbiddenException("Access denied");
    // }
    
    throw new ForbiddenException("Access denied");
  }
}
