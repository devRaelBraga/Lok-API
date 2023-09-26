import { BadRequestException, Injectable, UnauthorizedException  } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { Message } from '@prisma/client';
import { PrismaService } from '../../../config/database/prisma.service';
import { createMessageDTO } from './message.dto';


@Injectable()
export class MessageService {
    constructor(private userService: UsersService, private prisma: PrismaService){}

    async createMessage({senderId, receiverId, content}:createMessageDTO): Promise<Message>{
        try {

            if(senderId === receiverId){
                throw new BadRequestException('Sender and receiver must not be the same')
            }

            const usersValidPromises = [
                this.userService.getUserById({id: senderId}),
                this.userService.getUserById({id: receiverId})
            ];
    
            const [user1, user2] = await Promise.all(usersValidPromises);
    
            if(user1 instanceof BadRequestException || user2 instanceof BadRequestException){
                throw new BadRequestException('Users must be valid');
            }
            
            if(content.length === 0){
                throw new BadRequestException('Message cannot be empty');
            }
    
            return this.prisma.message.create({
                data:{
                    senderId: '',
                    receiverId: '',
                    content: '',
                    timestamp: new Date(),
                }
            });

        } catch (error) {
            return error;
        }
    }
}