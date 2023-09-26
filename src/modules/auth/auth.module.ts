import { Module } from '@nestjs/common';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConstants } from 'config/consts';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '7d' },
  })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}