import { IsEmail, IsNotEmpty, MinLength, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user' })
  @IsString()
  @IsNotEmpty({ message: "name is not null" })
  readonly name: string;

  @ApiProperty({ description: 'Email of the user' })
  @IsEmail({}, { message: "invalid email format" })
  @IsNotEmpty({ message: "email is not null" })
  readonly email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @MinLength(6, { message: "min length - 6" })
  @IsNotEmpty({ message: "password is not null" })
  readonly password: string;
}
