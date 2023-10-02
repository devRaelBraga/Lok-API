import { BadRequestException, Controller, Post, Put, Req } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from '@prisma/client';
import { createUserDTO, updateUserDTO } from './user.dto';
import { Request } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { createUserSwagger, updateUserSwagger } from './user.swagger';

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UsersService) {}

    @Post('/create')
    @ApiBody(createUserSwagger)
    @ApiTags('User')
    async createUser(@Req() request: Request): Promise<User> {
        try {
            const {name, email, password} = request.body;

            if(!name || typeof(name) !== 'string' || name.length === 0) {
                throw new BadRequestException('Name is required');
            }

            if(!email || typeof(email) !== 'string' || email.length === 0) {
                throw new BadRequestException('Email is required');
            }

            if(!password || typeof(password) !== 'string' || password.length === 0) {
                throw new BadRequestException('Password is required');
            }

            return await this.userService.createUser({name, email, password});
        } catch (error) {
            return error;
        }
    }

    @Put('/update')
    @ApiBody(updateUserSwagger)
    @ApiTags('User')
    async updateUser(@Req() request: Request): Promise<User> {
        try {
            const update:updateUserDTO = request.body;

            if(!update.id || typeof(update.id) !== 'string') {
                throw new BadRequestException('Id is required');
            }
            if(update.name && typeof(update.name) !== 'string') {
                throw new BadRequestException('Invalid name');
            }
            if(update.password && (typeof(update.password) !== 'string')) {
                throw new BadRequestException('Invalid password');
            }
            if(update.profilePicUrl && typeof(update.profilePicUrl) !== 'string') {
                throw new BadRequestException('Invalid profilePicUrl');
            }

            return await this.userService.updateUser(update);
        } catch (error) {
            return error;
        }
    }
}
