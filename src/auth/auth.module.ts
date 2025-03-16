import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './services/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule], // Remove JwtModule here
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
