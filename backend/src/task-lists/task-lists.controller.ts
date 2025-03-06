import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { Role } from '../common/decorators/roles.decorator';
import { TaskListService } from './task-lists.service';
import { CreateTaskListDto } from './dto/create-task-list.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import type { Request as ExpressRequest } from 'express';
import { UserPayload } from '../common/guards/user.payload';
import { AddMemberDto } from './dto/add.member.dto';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('task-lists')
@Controller('task-lists')
export class TaskListController {
  constructor(private readonly taskListService: TaskListService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі списки завдань' })
  async findAll() {
    return await this.taskListService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати список завдань за ID' })
  @ApiResponse({ status: 200, description: 'Список завдань знайдено.' })
  @ApiResponse({ status: 404, description: 'Список завдань не знайдено.' })
  async findOne(@Param('id') id: string) {
    const taskListId = Number(id);
    if (isNaN(taskListId)) {
      throw new BadRequestException('Некоректний ID');
    }
    return await this.taskListService.findOne(taskListId);
  }
  

  @Post()
  @Role('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Створити новий список завдань' })
  async create(
    @Body() createTaskListDto: CreateTaskListDto,
    @Request() req: ExpressRequest
  ) {
    const user = req.user as UserPayload;
    if (!user.id) {
      throw new UnauthorizedException('Відсутній id користувача');
    }
    return await this.taskListService.create(createTaskListDto, user);
  }
  

  @Delete(':id')
  @Role('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Видалити список завдань за ID' })
  @ApiResponse({ status: 200, description: 'Список завдань видалено.' })
  @ApiResponse({ status: 404, description: 'Список завдань не знайдено.' })
  async remove(@Param('id') id: string) {
    const taskListId = parseInt(id, 10);
    return await this.taskListService.remove(taskListId);
  }

  @Post(':id/members')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Role('ADMIN')
@ApiOperation({ summary: 'Додати співучасника за email' })
async addMember(
  @Param('id') id: string,
  @Body() addMemberDto: AddMemberDto
) {
  return await this.taskListService.addMember(Number(id), addMemberDto.email);
}
}
