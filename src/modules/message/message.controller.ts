import { Controller, Get, Post, Req, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { MessageService } from './message.service';
import { ApiBody } from '@nestjs/swagger';
import { getChatHistorySwagger, sendMessageSwagger } from './message.swagger';


@Controller('/message')
export class MessageController{
    constructor(private readonly messageService: MessageService) {}

    @Post('/send')
    @ApiBody(sendMessageSwagger)
    async sendMessage(@Req() request: Request) {
        try {
            const {senderId, receiverId, content} = request.body;
    
            if(!senderId || !receiverId) {
                throw new BadRequestException('Invalid user');
            }

            if(!content || (content.length === 0)) {
                throw new BadRequestException('Message cannot be empty');
            }
            
            return this.messageService.createMessage({senderId, receiverId, content});
        } catch (error) {
            return error;
        }
    }

    @Post()
    @ApiBody(getChatHistorySwagger)
    async getChatHistory(@Req() request: Request) {
        try {
            const {user1Id, user2Id} = request.body;
    
            if(!user1Id || !user2Id){
                throw new BadRequestException('Invalid user');
            }
    
            return await this.messageService.getChatHistory({user1Id, user2Id});
        } catch (error) {
            return error;
        }
    }
}
