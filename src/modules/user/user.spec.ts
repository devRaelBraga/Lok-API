import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../config/database/prisma.service';
import { userDummy } from '../../../test/mocks/dummies';
import { PrismaServiceMock, UserServiceMock } from '../../../test/mocks/service-mocks';

describe('User Service', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [ UsersService, {
        provide: PrismaService,
        useClass: PrismaServiceMock
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

      expect(Object.keys(result)).toStrictEqual(Object.keys(userDummy));
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

      expect(Object.keys(result)).toStrictEqual(Object.keys(userDummy));
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
        useClass: UserServiceMock,
      }],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('[create user]', () => {
    it('should return a user', async () => {
      const req: any = {
        body: {
          name: 'John',
          email: 'john@example.com',
          password: 'password',
        }
      }

      const result = await userController.createUser(req);

      expect(Object.keys(result)).toStrictEqual(Object.keys(userDummy));
    });
  });

  describe('[create user] name invalid', () => {
    it('should return a Name is required error', async () => {
      const req: any = {
        body: {
          email: 'john@example.com',
          password: 'password',
        }
      }

      const result:any = await userController.createUser(req)

      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('Name is required');
    })
  });

  describe('[create user] email invalid', () => {
    it('should return a Email is required error', async () => {
      const req: any = {
        body: {
          name: 'John',
          password: 'password',
        }
      }

      const result:any = await userController.createUser(req)

      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('Email is required');
    })
  })
  
  describe('[create user] password invalid', () => {
    it('should return a Name is required', async () => {
      const req: any = {
        body: {
          name: 'John',
          email: 'john@example.com',
        }
      }

      const result:any = await userController.createUser(req)

      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('Password is required');
    })
  })

});
