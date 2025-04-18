import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ email, password: hashedPassword, name });
    return this.userRepo.save(user);
  }

  async login(email: string, password: string, userAgent: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '24h' });

    user.refreshToken = refreshToken;
    user.userAgent = userAgent;
    await this.userRepo.save(user);

    return { accessToken, refreshToken };
  }

  async refreshToken(oldRefreshToken: string, userAgent: string) {
    const user = await this.userRepo.findOne({ where: { refreshToken: oldRefreshToken } });

    if (!user || user.userAgent !== userAgent) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    return { accessToken };
  }

  async logout(userId: number) {
    await this.userRepo.update(userId, { refreshToken: null, userAgent: null });
    return { message: 'Logged out successfully' };
  }
}
