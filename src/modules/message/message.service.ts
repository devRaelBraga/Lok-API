import { BadRequestException, Injectable, UnauthorizedException  } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { Message } from '@prisma/client';
import { PrismaService } from '../../../config/database/prisma.service';
import { createMessageDTO, getChatHistoryDTO, validateUserPairDTO } from './message.dto';


@Injectable()
export class MessageService {
    constructor(private userService: UsersService, private prisma: PrismaService){}

    async validateUserPair({user1Id, user2Id}: validateUserPairDTO): Promise<boolean> {
        if(user1Id === user2Id) {
            return false;
        }

        const usersValidPromises = [
            this.userService.getUserById({id: user1Id}),
            this.userService.getUserById({id: user2Id})
        ];

        const [user1, user2] = await Promise.all(usersValidPromises);

        if(user1 instanceof BadRequestException || user2 instanceof BadRequestException) {
            return false;
        }

        return true;
    }

    async createMessage({senderId, receiverId, content}:createMessageDTO): Promise<Message>{
        try {
            
            const usersValid = await this.validateUserPair({user1Id: senderId, user2Id: receiverId});

            if(!usersValid){
                throw new BadRequestException('Invalid user');
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

    async getChatHistory({user1Id, user2Id}: getChatHistoryDTO): Promise<Message[]> {
        try {

            const usersValid = await this.validateUserPair({user1Id, user2Id});

            if(!usersValid){
                throw new BadRequestException('Invalid user');
            }

            const messages = await this.prisma.message.findMany({
                where: {
                    OR: [
                        {
                            senderId: user1Id,
                            receiverId: user2Id
                        }, {
                            senderId: user2Id,
                            receiverId: user1Id
                        }
                    ]
                },
                orderBy: {
                    timestamp:'desc'
                }
            });

            return messages;
        } catch (error) {
            return error;
        }
    }
    
}