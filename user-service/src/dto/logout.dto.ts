import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: 1,
  })
  userId: number;
}
