import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'config/database/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
