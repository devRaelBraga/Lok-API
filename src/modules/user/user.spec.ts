import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../config/database/prisma.service';
import { User } from '@prisma/client';
import { createUserDTO } from './user.dto';

describe('User Service', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: PrismaService,
        useClass: prismaMock
      }],
    }).compile();

    userService = app.get<UsersService>(UsersService);
  });

  describe('[create user]', () => {
    it('should return a user', async () => {
      const result = await userService.createUser({
        name: 'John',
        email: 'john@example.com',
        password: 'password',
      });

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('password');
      expect(result).toHaveProperty('profilePicUrl');
      expect(result).toHaveProperty('publicKey');
      expect(result).toHaveProperty('privateKey');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });
  
  describe('[create user] username less than 3 chars', () => {
    it('should return a Invalid name error', async () => {
      const result:any = await userService.createUser({
        name: 'Jn',
        email: 'john@example.com',
        password: 'password',
      });

      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('Username must be at least 3 characters');
    });
  });
  
  describe('[create user] invalid email', () => {
    it('should return a Invalid email error', async () => {
      const result:any = await userService.createUser({
        name: 'John',
        email: 'john@',
        password: 'password',
      });
      
      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('Invalid email');
    });
  });
  
  describe('[create user] password less than 6 chars', () => {
    it('should return a Invalid password error', async () => {
      const result:any = await userService.createUser({
        name: 'John',
        email: 'john@example.com',
        password: 'pass',
      });
      
      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('Password must be at least 6 characters');
    });
  });
  
  describe('[create user] user already exists', () => {
    it('should return a User already exists error', async () => {
      const result:any = await userService.createUser({
        name: 'Existent user',
        email: 'existent@user.com',
        password: 'password',
      });
      
      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('User already exists');
    });
  });
  

  describe('[getUser]', () => {
    it('should return a user', async () => {
      const result = await userService.getUser({
        email: 'existent@user.com',
      });

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('password');
      expect(result).toHaveProperty('profilePicUrl');
      expect(result).toHaveProperty('publicKey');
      expect(result).toHaveProperty('privateKey');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('[getUser] user not foud', () => {
    it('should return a User not found error', async () => {
      const result: any = await userService.getUser({
        email: 'nonexistent@user.com',
      });

      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('User not found');
    });
  });
});

describe('User Controller', () => {
  let userController: UserController;
  
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: UsersService,
        useClass: userServiceMock,
      }],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('create user', () => {
    it('should return a user', async () => {
      const req: any = {
        body: {
          name: 'John',
          email: 'john@example.com',
          password: 'password',
        }
      }
      expect(await userController.createUser(req)).toHaveProperty('createdAt');
    });
  });

});

const userDummy: User = {
  id: '1234-5678-9101',
  name: 'John',
  email: 'existent@user.com',
  password: '$2b$10$cXXkaB5RsrAzHKjLovamqORZJQAt5.Gk4SUyrI/LsnSwlqlHtgYlC',
  profilePicUrl: '',
  privateKey: '',
  publicKey: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

class userServiceMock {
  createUser({name, email, password}: createUserDTO):User{
    return userDummy;
  }
}

class prismaMock {
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
