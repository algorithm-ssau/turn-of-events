import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth.service';
import { RegisterDto } from 'src/dto/register.dto';
import { LoginDto } from 'src/dto/login.dto';
import { RefreshDto } from 'src/dto/refresh.dto';
import { LogoutDto } from 'src/dto/logout.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ type: RegisterDto })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @Post('login')
  @ApiHeader({
    name: 'User-Agent',
    description: 'User-Agent of the client making the request \n Example: User-Agent: TestClient/1.0',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ type: LoginDto })
  login(@Body() body: LoginDto, @Req() req) {
    return this.authService.login(body.email, body.password, req.headers['user-agent']);
  }

  @Post('refresh')
  @ApiHeader({
    name: 'User-Agent',
    description: 'User-Agent of the client making the request \n Example: User-Agent: TestClient/1.0',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ type: RefreshDto })
  refresh(@Body() body: RefreshDto, @Req() req) {
    return this.authService.refreshToken(body.refreshToken, req.headers['user-agent']);
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiBody({ type: LogoutDto })
  logout(@Body() body: LogoutDto) {
    return this.authService.logout(body.userId);
  }
}
