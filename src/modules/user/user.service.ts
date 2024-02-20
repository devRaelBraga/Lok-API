import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/database/prisma.service';
import { createUserDTO, getUserByIdDTO, getUserDTO, updateUserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { S3_UploadImage } from 'src/s3.handler';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}
    private saltRounds = 10;

    async createUser({name, email, password, identityKey, photo}: createUserDTO): Promise<User>{

        try {
            // console.log({photo})
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    
            if(name.length < 3) {
                throw new BadRequestException('Username must be at least 3 characters')
            }
    
            if(!emailRegex.test(email)){
                throw new BadRequestException('Invalid email');
            }
            
            if(password.length < 6){
                throw new BadRequestException('Password must be at least 6 characters');
            }

            const userFound = await this.prisma.user.findUnique({
                where: {
                    email
                }
            })

            if(userFound){
                throw new BadRequestException('User already exists')
            }

            const hash = await bcrypt.hash(password, this.saltRounds);
            const pic = await S3_UploadImage({userEmail: email, data: photo});
    
            return await this.prisma.user.create(
                { data: {
                    name,
                    email,
                    password: hash,
                    profilePicUrl: pic,
                    identityKey,
                }
            })
        } catch (error) {
            console.log(error);
            return error
        }
        
    }

    async getUser({email}: getUserDTO): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email
                }
            });

            if(!user){
                throw new BadRequestException('User not found');
            }

            return user;
            
        } catch (error) {
            return error;
        }

    }

    async getUserById({id}: getUserByIdDTO): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id
                }
            });

            if(!user){
                throw new BadRequestException('User not found');
            }

            return user;
            
        } catch (error) {
            return error;
        }
    }

    async updateUser(updates: updateUserDTO): Promise<User>{
        try {
            if(updates.password){
                updates.password = await bcrypt.hash(updates.password, this.saltRounds);
            };

            const result = await this.prisma.user.update({
                where: {
                    id: updates.id
                },
                data: {...updates}
            });

            if(!result){
                throw new BadRequestException('User not found');
            };
            
            return result;
        } catch (error) {
            return error;
        }
    }

    async getAllUsers({id}){
        try {
            if(String(id).includes('@')){
                id = await this.prisma.user.findUnique({
                    where: {
                        email: id
                    }
                })
                id = id.id
            }


            const users: any[] = await this.prisma.user.findMany({
                select: {
                    name: true,
                    email: true,
                    identityKey: true,
                    profilePicUrl: true
                }
            })

            var groups: any[] = await this.prisma.usersOnGroups.findMany({
                where: {
                    userId: id,
                },
                select: {
                    groupId: true,
                }
            })

            groups = groups.map(group =>
                group.groupId
            )

            console.log(groups)

            groups = await this.prisma.group.findMany({
                where:{
                    OR: [
                        {
                            adminId: {
                                equals: id
                            }
                        },
                        {
                            id: {
                                in: groups
                            }
                        }
                    ]
                }
            })

            const response = [...groups, ...users]


            return response
        } catch (error) {
            return error;
        }
    }
}