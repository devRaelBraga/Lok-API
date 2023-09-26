import { User } from "@prisma/client";
import { loginReturnDTO } from "src/modules/auth/auth.dto";

export const jwtTokenDummy:loginReturnDTO = {
    name: 'name',
    email: 'email', 
    profilePicUrl: 'profilePicUrl',
    privateKey: 'privateKey',
    token: 'token'
}

export const userDummy: User = {
    id: '1234-5678-9101',
    name: 'John',
    email: 'existent@user.com',
    password: '$2b$10$cXXkaB5RsrAzHKjLovamqORZJQAt5.Gk4SUyrI/LsnSwlqlHtgYlC', // password
    profilePicUrl: '',
    privateKey: '',
    publicKey: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };