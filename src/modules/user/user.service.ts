import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../config/database/prisma.service';
import { createUserDTO, getUserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    async createUser({name, email, password}: createUserDTO): Promise<User>{
        const saltRounds = 10;

        try {
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

            const hash = await bcrypt.hash(password, saltRounds);
    
            return await this.prisma.user.create(
                { data: {
                    name,
                    email,
                    password: hash,
                    profilePicUrl: '',
                    publicKey: '',
                    privateKey: '',
                }
            })
        } catch (error) {
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
}