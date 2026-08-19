import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'Password123!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    // Same global configuration as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new AllExceptionsFilter());

    await app.init();

    // Register test user before login tests
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /auth/login - Success (200 with access_token)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(testUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
  });

  it('POST /auth/login - Failure (401 Wrong Password)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword!',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('statusCode', 401);
  });
});