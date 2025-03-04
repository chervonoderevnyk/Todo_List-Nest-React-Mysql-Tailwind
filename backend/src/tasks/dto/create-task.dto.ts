  import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

  export class  CreateTaskDto {
    @ApiProperty({ description: "Title of the task" })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: "Description of the task" })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ description: "ID of the user who owns the task list" })
    @IsNotEmpty({ message: "Task list ID is required" })
    @IsNumber()
    taskListId: number;
  }
