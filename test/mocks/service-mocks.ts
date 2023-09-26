import { User } from "@prisma/client";
import { jwtTokenDummy, userDummy } from "./dummies";
import { loginReturnDTO } from "src/modules/auth/auth.dto";
import { createUserDTO } from "src/modules/user/user.dto";

export class UserServiceMock {
    async getUser({email}): Promise<User> {
        return userDummy;
    }

    createUser({name, email, password}: createUserDTO):User{
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
  
        return false
      },
      create: (condition) => {
        return userDummy;
      }
    };
}
