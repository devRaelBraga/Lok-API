import { BadRequestException, Injectable, UnauthorizedException  } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { loginDTO, loginReturnDTO } from './auth.dto';
import { UsersService } from '../user/user.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService){}

    async login({email, password}: loginDTO): Promise<loginReturnDTO> {
        try {
            const user = await this.userService.getUser({email});
            console.log(user);

            if(user instanceof BadRequestException) {
                throw new BadRequestException('User not found');
            }

            const passwordOk = await bcrypt.compare(password, user.password);

            if(!passwordOk) {
                throw new UnauthorizedException('Invalid password');
            }

            const token = await this.jwtService.signAsync({
                id: user.id,
                email: user.email,
            })

            return {
                name: user.name,
                email: user.email, 
                profilePicUrl: user.profilePicUrl,
                identityKey: user.identityKey,
                token: token
            };

        } catch (error) {
            console.log(error);
            return error;
        }
    }

}