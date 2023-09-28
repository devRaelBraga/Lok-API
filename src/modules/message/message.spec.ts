import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common/exceptions';
import { MessageService } from './message.service';
import { messageDummy } from '../../../test/mocks/dummies';
import { UsersService } from '../user/user.service';
import { MessageServiceMock, PrismaServiceMock, UserServiceMock } from '../../../test/mocks/service-mocks';
import { PrismaService } from '../../../config/database/prisma.service';
import { MessageController } from './message.controller';

describe('Message Service', () => {
  let messageService: MessageService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService, {
        provide: UsersService,
        useClass: UserServiceMock
        }, {
        provide: PrismaService,
        useClass: PrismaServiceMock
      }],
    }).compile();

    messageService = app.get<MessageService>(MessageService);
  });
  
  describe('[create message]', () => {
    it('should return a created message', async () => {
        const result = await messageService.createMessage({
            senderId: '123',
            receiverId: '321',
            content: 'Hello World!'
        })

        expect(Object.keys(result)).toStrictEqual(Object.keys(messageDummy));
    });
  });

  describe('[get message]', () => {
    it('should return messages', async () => {
        const result = await messageService.getChatHistory({
            user1Id: '123',
            user2Id: '321',
        })

        expect(Object.keys(result[0])).toStrictEqual(Object.keys(messageDummy));
    });
  });

  describe('[validate user pair]', () => {
    it('should return true', async () => {
        const result = await messageService.validateUserPair({
            user1Id: '123',
            user2Id: '321',
        })

        expect(result).toBe(true);
    });
  
    describe('[validate user pair] user not found error', () => {
      it('should return false', async () => {
          const result:any = await messageService.validateUserPair({
              user1Id: '000',
              user2Id: '321',
          })
  
          expect(result).toBe(false);
      });
    });
  
    describe('[validate user pair] users with same Id', () => {
      it('should return false', async () => {
          const result:any = await messageService.validateUserPair({
              user1Id: '123',
              user2Id: '123',
          })
  
          expect(result).toBe(false);
      });
    });
  });
});

describe('Message Controller', () => {
  let messageController: MessageController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [{
        provide: MessageService,
        useClass: MessageServiceMock
      }],
    }).compile();

    messageController = app.get<MessageController>(MessageController);
  });
  
  describe('[send message]', () => {
    it('should return a created message', async () => {
      const req: any = {
        body: {
          senderId: '123',
          receiverId: '123',
          content: 'Hello World!',
        }
      }

      const result = await messageController.sendMessage(req);

      expect(Object.keys(result)).toStrictEqual(Object.keys(messageDummy));
    });

    describe('[send message] invalid user', () => {
      it('should return a Invalid user error', async () => {
        const req: any = {
          body: {
            receiverId: '123',
            content: 'Hello World!',
          }
        }

        const result: any = await messageController.sendMessage(req);

        expect(result instanceof BadRequestException).toBe(true);
        expect(result.message).toBe('Invalid user');
      });
    });
      
    describe('[send message] empty', () => {
      it('should return a Empty message error', async () => {
        const req: any = {
          body: {
            senderId: '123',
            receiverId: '123',
            content: '',
          }
        }

        const result: any = await messageController.sendMessage(req);

        expect(result instanceof BadRequestException).toBe(true);
        expect(result.message).toBe('Message cannot be empty');
      });
    });
  });

  describe('[get chat history]', () => {  
    it('should return a created message', async () => {
      const req: any = {
        body: {
          user1Id: '123',
          user2Id: '321',
        }
      }

      const result = await messageController.getChatHistory(req);

      expect(Object.keys(result[0])).toStrictEqual(Object.keys(messageDummy));
    });

    describe('[get chat history] invalid user', () => {
      it('should return a Invalid user error', async () => {
        const req: any = {
          body: {
            user1Id: '123',
            user2Id: '123',
          }
        }
  
        const result: any = await messageController.sendMessage(req);
  
        expect(result instanceof BadRequestException).toBe(true);
        expect(result.message).toBe('Invalid user');
      });
    });
  });
 
});
