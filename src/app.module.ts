import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './modules/message/messages.module';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, MessageModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
