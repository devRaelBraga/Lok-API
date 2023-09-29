import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from '@prisma/client';
import { createUserDTO } from './user.dto';
import { Request } from 'express';
import { ApiBody } from '@nestjs/swagger';
import { createUserSwagger } from './user.swagger';

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UsersService) {}

    @Post('/create')
    @ApiBody(createUserSwagger)
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
}
