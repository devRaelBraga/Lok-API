import { Module } from '@nestjs/common';
import { MessageModule } from './modules/message/messages.module';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatGateway } from './modules/chat/chat.gateway';

@Module({
  imports: [AuthModule, MessageModule, UsersModule],
  providers: [ChatGateway],
})
export class AppModule {}
