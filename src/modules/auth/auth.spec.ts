import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { jwtTokenDummy } from '../../../test/mocks/dummies';
import { AuthServiceMock, JwtServiceMock, UserServiceMock } from '../../../test/mocks/service-mocks';

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

      expect(Object.keys(result)).toStrictEqual(Object.keys(jwtTokenDummy));
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

      expect(Object.keys(result)).toStrictEqual(Object.keys(jwtTokenDummy));
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
