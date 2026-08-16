import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;          // AdminUser.id
  email: string;
  restaurantId: string;
  restaurantSlug: string;
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

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.restaurantId) {
      throw new UnauthorizedException();
    }
    // This object is attached to request.user
    return {
      id: payload.sub,
      email: payload.email,
      restaurantId: payload.restaurantId,
      restaurantSlug: payload.restaurantSlug,
    };
  }
}
