import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { EncriptionService } from '../encription/encription.service';
import { MessageController } from './message.controller';
import { PrismaService } from 'config/database/prisma.service';
import { UsersService } from '../user/user.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, EncriptionService, PrismaService, UsersService],
  exports: [],
})
export class MessageModule {}
