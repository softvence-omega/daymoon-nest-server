import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET ?? 'SECRET_KEY',
      ignoreExpiration: false,
    } satisfies StrategyOptions);
  }

  validate(payload: JwtPayload): AuthUser {
    // console.log('JWT payload:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}