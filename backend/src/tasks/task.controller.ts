import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common";

import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/decorators/roles.decorator';
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { PermissionsRoleUserGuard } from "../common/guards/permissions.role.user.guard";

@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  // @UseGuards(AuthGuard)
  findAll() {
    return this.taskService.findAll();
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  findOne(@Param("id") id: string) {
    const taskId = parseInt(id, 10);
    return this.taskService.findOne(taskId);
  }

  @Post()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Role('ADMIN')
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Put(":id")
  @UseGuards(AuthGuard, PermissionsRoleUserGuard)
  @Role('ADMIN')
  update(@Param("id") id: string, @Body() updateTaskDto: { title?: string; description?: string; completed?: boolean }) {
    const taskId = parseInt(id, 10);
    return this.taskService.update(taskId, updateTaskDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Role('ADMIN')
  remove(@Param("id") id: string) {
    const taskId = parseInt(id, 10);
    return this.taskService.remove(taskId);
  }
}
