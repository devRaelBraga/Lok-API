import { Controller, Post, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO, loginReturnDTO } from './auth.dto';
import { Request } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { loginSwagger } from './auth.swagger';


@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    
    @Post('/login')
    @ApiBody(loginSwagger)
    @ApiTags('Auth')
    async login(@Req() request: Request): Promise<loginReturnDTO> {
        try {
            const {email, password}:loginDTO = request.body;

            if(!email || typeof(email) !== 'string' || email.length === 0) {
                throw new BadRequestException('Email is required');
            }

            if(!password || typeof(password) !== 'string' || password.length === 0) {
                throw new BadRequestException('Password is required');
            }

            const result = await this.authService.login({email, password});

            return result;
        } catch (error) {
            return error;
        }
  }
}
