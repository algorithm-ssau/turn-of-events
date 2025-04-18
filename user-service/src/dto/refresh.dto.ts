import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({
    description: 'Refresh токен',
    example: 'your_refresh_token',
  })
  refreshToken: string;
}
