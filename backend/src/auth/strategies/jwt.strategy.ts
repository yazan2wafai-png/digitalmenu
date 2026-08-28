import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { AdminRole } from '../../common/roles.enum';
import { StaffRole } from '../../common/staff-role.enum';

export interface JwtPayload {
  sub: string;          // AdminUser.id
  email: string;
  restaurantId: string | null;
  restaurantSlug: string | null;
  role: AdminRole | string;
  staffRole?: StaffRole | string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  restaurantId: string | null;
  restaurantSlug: string | null;
  role: AdminRole | string;
  staffRole?: StaffRole | string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is not defined in environment');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (!payload.sub || (!payload.restaurantId && payload.role !== AdminRole.SUPER_ADMIN && payload.role !== 'SUPER_ADMIN')) {
      throw new UnauthorizedException();
    }
    // This object is attached to request.user
    return {
      id: payload.sub,
      email: payload.email,
      restaurantId: payload.restaurantId ?? null,
      restaurantSlug: payload.restaurantSlug ?? null,
      role: payload.role,
      staffRole: payload.staffRole,
    };
  }
}
