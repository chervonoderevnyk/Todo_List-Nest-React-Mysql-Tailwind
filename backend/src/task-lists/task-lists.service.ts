import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { UserPayload } from '../common/guards/user.payload';

@Injectable()
export class TaskListService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const taskLists = await this.prisma.taskList.findMany({
      include: {
        members: {
          select: {
            user: {
              select: { id: true }
            }
          }
        }
      }
    });
  
    const totalTaskLists = taskLists.length;
    const taskListsWithMembers = taskLists.filter(tl => tl.members.length > 0).length;
    const taskListsWithoutMembers = totalTaskLists - taskListsWithMembers;
  
    return {
      totalTaskLists, // Загальна кількість списків
      taskListsWithMembers, // Кількість списків з учасниками
      taskListsWithoutMembers, // Кількість списків без учасників
      taskLists: taskLists.map(taskList => ({
        ...taskList,
        membersCount: taskList.members.length, // Кількість учасників у конкретному списку
        members: taskList.members.map(member => member.user) // Масив учасників { id }
      }))
    };
  }  

  async findOne(id: number) {
    const taskList = await this.prisma.taskList.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            user: {
              select: { id: true, email: true }
            }
          }
        }
      }
    });
  
    if (!taskList) {
      throw new NotFoundException(`Список завдань з ID ${id} не знайдено`);
    }
  
    return {
      ...taskList,
      membersCount: taskList.members.length,
      members: taskList.members.map(m => m.user)
    };
  }
  
  async create(createTaskListDto: CreateTaskListDto, owner: UserPayload) {
    const ownerId = Number(owner.id);
    if (isNaN(ownerId)) {
      throw new Error('Невірний id користувача');
    }

    const taskList = await this.prisma.taskList.create({
      data: {
        name: createTaskListDto.name,
        description: createTaskListDto.description,
        owner: {
          connect: { id: ownerId },
        },
      },
    });
    return taskList;
  }

  async remove(id: number) {
    const taskList = await this.prisma.taskList.findUnique({ where: { id } });
  
    if (!taskList) {
      throw new NotFoundException(`Список завдань з ID ${id} не знайдено`);
    }
  
    await this.prisma.taskList.delete({ where: { id } });
  
    return { message: `Список завдань "${taskList.name}" успішно видалено` };
  }

  async addMember(taskListId: number, email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Користувача з email ${email} не знайдено`);
    }
  
    // Перевірка, чи вже доданий користувач
    const existingMember = await this.prisma.taskListMember.findUnique({
      where: { userId_taskListId: { userId: user.id, taskListId } },
    });
    if (existingMember) {
      throw new BadRequestException('Користувач вже є в списку');
    }
  
    return await this.prisma.taskListMember.create({
      data: { userId: user.id, taskListId },
    });
  }
  
}
