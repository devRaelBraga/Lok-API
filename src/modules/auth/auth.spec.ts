import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { User } from '@prisma/client';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { loginReturnDTO } from './auth.dto';

describe('Auth Service', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useClass: UserServiceMock
      }, {
        provide: JwtService,
        useClass: JwtServiceMock
      }],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  describe('[login]', () => {
    it('should return a JWT Token', async () => {
      const result = await authService.login({
          email: 'existent@user.com',
          password: 'password'
      })

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('profilePicUrl');
      expect(result).toHaveProperty('privateKey');
      expect(result).toHaveProperty('token');
    });
  });

  describe('[login] invalid password', () => {
    it('should return a Invalid password error', async () => {
      const result:any = await authService.login({
          email: 'existent@user.com',
          password: 'wrongpassword'
      })

      expect(result instanceof UnauthorizedException).toBe(true);
      expect(result.message).toBe('Invalid password');
    });
  });

});

describe('Auth Controller', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useClass: AuthServiceMock
      }],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('[login]', () => {
    it('should return a JWT Token', async () => {
      const req: any = {
        body: {
          email: 'existent@user.com',
          password: 'password'
        }
      }
      
      const result = await authController.login(req)

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('profilePicUrl');
      expect(result).toHaveProperty('privateKey');
      expect(result).toHaveProperty('token');
    });
  });

  describe('[login] email expected but not given', () => {
    it('should return a Email required error', async () => {
      const req: any = {
        body: {
          password: 'password'
        }
      }

      const result:any = await authController.login(req)

      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('Email is required');
    });
  });

  describe('[login] invalid password', () => {
    it('should return a Password required error', async () => {
      const req: any = {
        body: {
          email: 'existent@user.com',
        }
      }

      const result:any = await authController.login(req)

      expect(result instanceof BadRequestException).toBe(true);
      expect(result.message).toBe('Password is required');
    });
  });

});

class UserServiceMock {
  private userDummy: User = {
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
    async getUser({email}): Promise<User> {
        return this.userDummy;
    }
}

class AuthServiceMock {
  private jwtTokenDummy:loginReturnDTO = {
    name: 'name',
    email: 'email', 
    profilePicUrl: 'profilePicUrl',
    privateKey: 'privateKey',
    token: 'token'
  }

  async login({email, password}){
    return this.jwtTokenDummy
  }
}

class JwtServiceMock {
  async signAsync(payload: any): Promise<string>{
    return 'token';
  }
}