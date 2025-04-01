import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { AppService } from '../services/app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({ status: 200, description: 'Successful response.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })

  @Get()
  getHello(): string {
    /**
     * Example request:
     * GET /api/app
     */

    return 'Hello World!';
  }
}
