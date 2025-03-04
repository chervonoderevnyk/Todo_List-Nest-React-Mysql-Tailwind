import { IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskListDto {
  @ApiProperty({ description: "Name of the task list" })
  @IsString()
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(3, { message: "Name must be at least 3 characters long" })
  readonly name: string;

  @ApiProperty({ description: "Description of the task list", required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;
  
}
