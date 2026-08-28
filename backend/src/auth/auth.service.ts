import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

export interface AuthLoginResponse {
  access_token: string;
  restaurantSlug: string | null;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthLoginResponse> {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
      include: { restaurant: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      restaurantId: admin.restaurantId,
      restaurantSlug: admin.restaurant?.slug ?? null,
      role: admin.role,
      staffRole: admin.staffRole,
    };

    const token = this.jwt.sign(payload);

    return {
      access_token: token,
      restaurantSlug: admin.restaurant?.slug ?? null,
      email: admin.email,
    };
  }
}
