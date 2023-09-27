import { Controller, Post, Req, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { MessageService } from './message.service';


@Controller('/message')
export class MessageController{
    constructor(private readonly messageService: MessageService) {}

}
