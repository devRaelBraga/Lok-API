import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { messageDummy } from '../../../test/mocks/dummies';
import { UsersService } from '../user/user.service';
import { PrismaServiceMock, UserServiceMock } from '../../../test/mocks/service-mocks';
import { PrismaService } from '../../../config/database/prisma.service';

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
    it('should return a message', async () => {
        const result = await messageService.createMessage({
            senderId: '123',
            receiverId: '321',
            content: 'Hello World!'
        })

        expect(Object.keys(result)).toStrictEqual(Object.keys(messageDummy));
    });
  });
});
