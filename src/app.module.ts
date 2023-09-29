import { Module } from '@nestjs/common';
import { MessageModule } from './modules/message/messages.module';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, MessageModule, UsersModule],
})
export class AppModule {}
