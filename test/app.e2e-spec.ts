import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

import { UserService } from 'src/user/user.service';

import { sessionMiddleware } from 'src/auth/session.middleware';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import mongoFakeServer from './setupMongoMemoryServer';
import { parseCookie } from './test-utils';

const adminUser = {
  email: 'test@example.com',
  password: 'example',
};

const clientUser = {
  email: 'client@example.com',
  password: 'example',
  role: 'user',
};

const newTask = {
  title: 'Задача номер 1',
  description: 'Описание задачи ...',
  dueDate: '2024-10-19T00:00:00Z',
};

describe('App (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let userService: UserService;
  let adminAuthCookie: string;
  let adminUserId: string;
  let clientUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    configService = app.get<ConfigService>(ConfigService);
    userService = app.get<UserService>(UserService);

    app.use(sessionMiddleware(configService));
    app.use(passport.initialize());
    app.use(passport.session());

    await app.init();
  });

  afterAll(async () => {
    await mongoFakeServer.closeInMemoryMongo();
    await app.close();
  });

  // AUTHENTICATION //

  it('should response {isAuthenticated: false} to /auth/check', async () => {
    return request(app.getHttpServer()).get('/auth/check').expect({
      isAuthenticated: false,
    });
  });

  it('should register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/user/register')
      .send(adminUser)
      .expect(201);

    const createdUser = await userService.findUserByEmail(adminUser.email);
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(adminUser.email);

    await userService.updateUser(adminUserId, { role: 'admin' });
    adminUserId = res.body.id;
  });

  it('should login registered user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(adminUser);
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();

    adminAuthCookie = parseCookie(res.headers['set-cookie'][0]);
  });

  it('should receive authenticated true by /auth/check after login', async () => {
    return request(app.getHttpServer())
      .get('/auth/check')
      .set('Cookie', [adminAuthCookie])
      .expect({
        isAuthenticated: true,
        userInfo: {
          email: 'test@example.com',
        },
      });
  });

  // USERS //

  it('should create new user', async () => {
    const res = await request(app.getHttpServer())
      .post(`/user`)
      .send(clientUser)
      .set('Cookie', [adminAuthCookie])
      .expect(201);
    expect(res.body.email).toBe(clientUser.email);
    clientUserId = res.body.id;
  });

  it('should update user', async () => {
    await request(app.getHttpServer())
      .patch(`/user/${clientUserId}`)
      .set('Cookie', [adminAuthCookie])
      .send({ role: 'user' })
      .expect(200);
  });

  it('should get user by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/user/by_id/${clientUserId}`)
      .set('Cookie', [adminAuthCookie])
      .expect(200);
    const foundUser = res.body;

    expect(foundUser.id).toBe(clientUserId);
    expect(foundUser).toHaveProperty('email');
  });

  it('should delete user', async () => {
    await request(app.getHttpServer())
      .delete(`/user/${clientUserId}`)
      .set('Cookie', [adminAuthCookie])
      .expect(200);
  });

  // TASK

  it('should create new task', async () => {
    const res = await request(app.getHttpServer())
      .post(`/task/`)
      .set('Cookie', [adminAuthCookie])
      .send(newTask)
      .expect(201);

    expect(res.body.title).toEqual(newTask.title);
    expect(res.body.description).toEqual(newTask.description);
  });

  // END //
  it('should logout', async () => {
    await request(app.getHttpServer())
      .get('/auth/logout')
      .set('Cookie', [adminAuthCookie])
      .expect({ message: 'Успешно вышли' });
    adminAuthCookie = '';
  });

  it('should receive {isAuthenticated: false} by /auth/check after logout', async () => {
    await request(app.getHttpServer())
      .get('/auth/check')
      .set('Cookie', [adminAuthCookie])
      .expect({ isAuthenticated: false });
  });
});
