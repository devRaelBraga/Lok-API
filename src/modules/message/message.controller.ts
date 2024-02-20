import { Controller, Get, Post, Req, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { MessageService } from './message.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { getChatHistorySwagger, sendMessageSwagger } from './message.swagger';


@Controller('/message')
export class MessageController{
    constructor(private readonly messageService: MessageService) {}

    @Post('/send')
    @ApiBody(sendMessageSwagger)
    @ApiTags('Message')
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
    @ApiTags('Message')
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

    @Post('/group')
    async createGroup(@Req() request: Request) {
        try {
            const {adminId, name, groupPic} = request.body;

            // console.log(adminId, name, groupPic)

            if(!adminId || !name) {
                throw new BadRequestException('Invalid request');
            }

            return await this.messageService.createGroup({adminId, name, groupPic})


        } catch (error) {
            console.log(error);
        }
    }

    @Post('/group/addUser')
    async addUser(@Req() request: Request) {
        try {
            
            const {adminId, name, userEmail} = request.body;

            if(!adminId || !name || !userEmail) {
                throw new BadRequestException('Invalid request');
            }

            const response = await this.messageService.addUser({adminId, name, userEmail})
            console.log(response)
            return response

        } catch (error) {
            console.log(error);
            return error
        }
    }

    @Post('/group/usersOnGroup')
    async getUsersOnGroup(@Req() request: Request) {
        try {
            
            const {groupId} = request.body;

            return await this.messageService.getUsersToAddToGroup({groupId})

        } catch (error) {
            console.log(error);
            return error
        }
    }
}
