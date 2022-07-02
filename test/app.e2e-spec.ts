import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Application Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  it('/api/users/:username/details (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/users/guilhermesantos001/details')
      .expect(200);
  });

  it('/api/users?since={number} (GET)', () => {
    return request(app.getHttpServer()).get('/api/users?since=1').expect(200);
  });

  it('/api/users/:username/repos?page={number} (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/users/guilhermesantos001/repos?page=1')
      .expect(200);
  });
});
