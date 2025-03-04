import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const taskList = await this.prisma.taskList.findUnique({
      where: { id: createTaskDto.taskListId },
    });
  
    if (!taskList) {
      throw new Error(`TaskList з id ${createTaskDto.taskListId} не знайдено`);
    }
  
    return await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        completed: false,
        taskList: { connect: { id: createTaskDto.taskListId } },
      },
    });
  }

  async findAll() {
    return await this.prisma.task.findMany();
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Завдання з ID ${id} не знайдено`);
    }
    return task;
  }  

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
  
    if (!task) {
      throw new NotFoundException(`Завдання з ID ${id} не знайдено`);
    }
  
    await this.prisma.task.delete({ where: { id } });
  
    return { message: `Завдання "${task.title}" успішно видалено` };
  }
  
}
