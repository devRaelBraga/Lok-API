import { BadRequestException, ConsoleLogger, Injectable, UnauthorizedException  } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { Message } from '@prisma/client';
import { PrismaService } from '../../../config/database/prisma.service';
import { createMessageDTO, getChatHistoryDTO, validateUserPairDTO } from './message.dto';
import { Group_S3 } from 'src/group.s3';


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
    
    async createGroup({adminId, name, groupPic}) {
        try {
            if(String(adminId).includes('@')){
                adminId = await this.prisma.user.findUnique({
                    where: {
                        email: adminId
                    }
                })
                adminId = adminId.id
            }
            console.log('aasdsadas', groupPic)
            
            const group = await this.prisma.group.create({
                data: {
                    adminId,
                    name,
                    groupPicUrl: await Group_S3({userEmail: name, data: groupPic})
                }
            })

            return group;

        } catch (error) {
            return error
        }
    }
    
    async addUser({adminId, name, userEmail}) {
        if(String(adminId).includes('@')){
            adminId = await this.prisma.user.findUnique({
                where: {
                    email: adminId
                }
            })
            adminId = adminId.id
        }

        try {
            const group = await this.prisma.group.findFirst({
                where: {
                    adminId,
                    name
                }
            })

            if(!group) {
                throw new BadRequestException("You must be the admin of the group");
            }

            const user = await this.userService.getUser({email:userEmail})
            
            await this.prisma.usersOnGroups.create({
                data: {
                    groupId: group.id,
                    userId: user.id
                }
            })

            return true;

        } catch (error) {
            return error
        }
    }

    async getUsersToAddToGroup({groupId}) {
        let groupMembers = await this.prisma.usersOnGroups.findMany({
            where: {
                groupId
            }
        })

        let members = []

        
        let admin:any = await this.prisma.group.findUnique({
            where: {
                id: groupId
            },
            select: {
                adminId: true
            }
        })
        
        admin = {userId: admin.adminId}
        
        groupMembers = [...groupMembers, admin]
        
        for (let i = 0; i < groupMembers.length; i++) {
            members.push(
                await this.prisma.user.findUnique({
                    where: {
                        id: groupMembers[i].userId
                    },
                    select:{
                        name: true,
                        email: true,
                        profilePicUrl: true,
                        identityKey: true,
                    }
                })
            )
        }

        let users = await this.prisma.user.findMany({where:{}, select:{
            name: true,
            email: true,
            profilePicUrl: true,
            identityKey: true,
        }})

        let response = {
            members,
            notMembers: users.filter(user => !members.find(i => i.email == user.email))
        }

        console.log(response)

        return response
        
    }

    async getGroupMembersById({groupId}) {
        let groupMembers: any = await this.prisma.usersOnGroups.findMany({
            where: {
                groupId
                
            },
            select: {
                userId: true
            }
        })

        let admin:any = await this.prisma.group.findUnique({
            where: {
                id: groupId
            },
            select: {
                adminId: true
            }
        })

        admin = {userId: admin.adminId}

        groupMembers = [...groupMembers, admin]

        let members = []

        for (let i = 0; i < groupMembers.length; i++) {
            members.push(
                await this.prisma.user.findUnique({
                    where: {
                        id: groupMembers[i].userId
                    },
                    select:{
                        email: true
                    }
                })
            )
        }
        
        console.log('groupMembers', members)

        return members
    }
}