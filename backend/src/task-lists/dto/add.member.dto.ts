import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
  @ApiProperty({ description: "Email користувача, якого додаємо" })
  @IsEmail({}, { message: "Некоректний email" })
  @IsNotEmpty({ message: "Email обов'язковий" })
  email: string;
}
