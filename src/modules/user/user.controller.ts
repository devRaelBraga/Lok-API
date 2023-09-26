import { Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from '@prisma/client';
import { createUserDTO } from './user.dto';
import { Request } from 'express';


@Controller('/user')
export class UserController {
    constructor(private readonly userService: UsersService) {}

    
    @Post()
    async createUser(@Req() request: Request): Promise<User> {
        try {
            const {name, email, password} = request.body;

            return await this.userService.createUser({name, email, password});
        } catch (error) {
            return error;
        }
  }
}
