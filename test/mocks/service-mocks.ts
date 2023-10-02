import { Message, User } from "@prisma/client";
import { jwtTokenDummy, messageDummy, userDummy } from "./dummies";
import { loginReturnDTO } from "src/modules/auth/auth.dto";
import { createUserDTO } from "src/modules/user/user.dto";
import { UsersService } from "src/modules/user/user.service";
import { BadRequestException } from "@nestjs/common";

export class UserServiceMock {
    async getUser({email}): Promise<User> {
        return userDummy;
    }

    async createUser({name, email, password}: createUserDTO):Promise<User>{
        return userDummy;
    }

    async getUserById({ id }: { id: string; }): Promise<User> {
      try {
        if(id === '000'){
          throw new BadRequestException('User not found');
        }
        return userDummy;
      } catch (error) {
        return error;
      }
    }

    async updateUser(){
      return userDummy;
    }
}

export class AuthServiceMock {
    async login({email, password}): Promise<loginReturnDTO>{
        return jwtTokenDummy;
}
}

export class JwtServiceMock {
    async signAsync(payload: any): Promise<string>{
        return 'token';
}
}

export class PrismaServiceMock {
    private user = {
      findUnique: (condition) => {
        if(condition.where?.email === 'existent@user.com'){
          return userDummy;
        }
        if(condition.where?.id === 'existentId'){
          return userDummy;
        }
  
        return false
      },
      create: (condition) => {
        return userDummy;
      },
      update: (condition) => {
        if(condition.where?.id === '123'){
          return false;
        }
        return {...userDummy, name: 'Joshua'};
      }
    };

    private message = {
      create: (condition) => {
        return messageDummy;
      },
      findMany: (condition) => {
        return [
          messageDummy,
          messageDummy
        ]
      }
    };
}

export class MessageServiceMock {
  async createMessage() {
    return messageDummy;
  }

  async getChatHistory() {
    return [
      messageDummy,
      messageDummy
    ]
  }
};