import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('Application Service', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Github', () => {
    it('should get user', async () => {
      const data = await service.getUser('guilhermesantos001');

      expect(data instanceof Error).not.toBe(true);

      if (!(data instanceof Error)) expect(data).toBeDefined();
    });

    it('should get users', async () => {
      const data = await service.getUsers(1);

      expect(data instanceof Error).not.toBe(true);

      if (!(data instanceof Error)) {
        expect(data.pagination.map((pagination) => pagination.type)).toContain(
          'next',
        );
        expect(data.users.length).toBeGreaterThan(0);
        expect(data.length).toBe(30);
      }
    });

    it('should get user repos', async () => {
      const data = await service.getUserRepos('guilhermesantos001');

      expect(data instanceof Error).not.toBe(true);

      if (!(data instanceof Error)) {
        expect(data.pagination.map((pagination) => pagination.type)).toContain(
          'next',
        );
        expect(data.repos.length).toBeGreaterThan(0);
        expect(data.length).toBe(30);
      }
    });
  });
});
