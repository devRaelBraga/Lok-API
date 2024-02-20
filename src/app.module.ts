import { Module } from '@nestjs/common';
import { MessageModule } from './modules/message/messages.module';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatGateway } from './modules/chat/chat.gateway';
import { GroupGateway } from './modules/chat/group.gateway';
import { MessageService } from './modules/message/message.service';
import { PrismaService } from 'config/database/prisma.service';

@Module({
  imports: [AuthModule, MessageModule, UsersModule],
  providers: [ChatGateway, 
    // {
    // provide: ChatGateway,
    // useExisting: ChatGateway,
    // inject: [MessageService, PrismaService],
    // }, 
    GroupGateway, MessageService, PrismaService],
})
export class AppModule {}
