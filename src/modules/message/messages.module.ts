import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { EncriptionService } from '../encription/encription.service';
import { MessageController } from './message.controller';

@Module({
  controllers: [MessageController],
  providers: [MessageService, EncriptionService],
  exports: [],
})
export class MessageModule {}
