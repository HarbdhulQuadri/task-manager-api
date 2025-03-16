import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'GTHYRSHHJ', // Default secret if env var missing
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload); // Debug log
    // Returning user data that will be attached to req.user
    return { userId: payload.sub, email: payload.email };
  }
}
