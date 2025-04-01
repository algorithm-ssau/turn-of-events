import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'securepassword',
  })
  password: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'User Name',
  })
  name: string;
}
