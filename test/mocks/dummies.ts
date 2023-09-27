import { Message, User } from "@prisma/client";
import { loginReturnDTO } from "src/modules/auth/auth.dto";

export const jwtTokenDummy:loginReturnDTO = {
    name: 'name',
    email: 'email', 
    profilePicUrl: 'profilePicUrl',
    privateKey: 'privateKey',
    token: 'token'
};

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

export const messageDummy: Message = {
    senderId: '1234-5678-9101',
    receiverId: '1098-7654-3210',
    content: 'Hello World!',
    timestamp: new Date(),
};

export const criptedMessageDummy: string = 'Hello World!'; // PUT HASH HERE

export const deCriptedMessageDummy: string = 'Hello World!';

export const privateKeyDummy: string = 'privateKey';

export const publicKeyDummy: string = 'publicKey';