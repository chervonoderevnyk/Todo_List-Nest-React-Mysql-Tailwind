import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Users')
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users.' })
  @ApiResponse({ status: 404, description: 'Users not found.' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param("id") id: string): Promise<User | null> {
    return this.userService.findOne(+id);
  }

  @Post("/sign-up")
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Param("id") id: string): Promise<User> {
    return this.userService.remove(+id);
  }
}
