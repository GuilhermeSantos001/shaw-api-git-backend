import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('Application Controller', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Github API', () => {
    it('should return user', async () => {
      const data = await appController.user('guilhermesantos001');

      expect(data instanceof HttpException).not.toBe(true);

      if (!(data instanceof HttpException)) {
        expect(data).toBeDefined();
      }
    });

    it('should return users', async () => {
      const data = await appController.users(1);

      expect(data instanceof HttpException).not.toBe(true);

      if (!(data instanceof HttpException)) {
        expect(data.pagination.map((pagination) => pagination.type)).toContain(
          'next',
        );
        expect(data.users.length).toBeGreaterThan(0);
        expect(data.length).toBe(30);
      }
    });

    it('should return repos', async () => {
      const data = await appController.repos('guilhermesantos001', 1);

      expect(data instanceof HttpException).not.toBe(true);

      if (!(data instanceof HttpException)) {
        expect(data.pagination.map((pagination) => pagination.type)).toContain(
          'next',
        );
        expect(data.repos.length).toBeGreaterThan(0);
        expect(data.length).toBe(30);
      }
    });
  });
});
