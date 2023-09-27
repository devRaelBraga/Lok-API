import { Test, TestingModule } from '@nestjs/testing';
import { EncriptionService } from './encription.service';
import { criptedMessageDummy, deCriptedMessageDummy, privateKeyDummy, publicKeyDummy } from 'test/mocks/dummies';

describe('Encription Service', () => {
  let encriptionService: EncriptionService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [EncriptionService],
    }).compile();

    encriptionService = app.get<EncriptionService>(EncriptionService);
  });

  describe('[cript message]', () => {
    it('should return a cripted message', async () => {
        const result = await encriptionService.criptMessage({
            message: deCriptedMessageDummy,
            key: publicKeyDummy
        })

        expect(result).toBe(criptedMessageDummy);
    });
  });

  describe('[decript message]', () => {
    it('should return a decripted message', async () => {
        const result = await encriptionService.deCriptMessage({
            message: criptedMessageDummy,
            key: privateKeyDummy
        })

        expect(result).toBe(deCriptedMessageDummy);
    });
  });
});
