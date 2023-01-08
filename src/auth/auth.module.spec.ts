import { INestApplication } from '@nestjs/common';
import { getAppInstance } from '../app.testing-module';
import request from 'supertest';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';

describe('Auth module', () => {
  let app: INestApplication;
  const userCredentials = {
    email: 'test@test.pl',
    password: '!QAZxsw2',
  };
  let accessToken: string;

  beforeAll(async () => {
    app = await getAppInstance();
  });

  it('POST /auth/signup', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ ...userCredentials, callbackUrl: 'https://google.com' })
      .expect(201);
  });

  it('POST /auth/verify-email/:token', async () => {
    const userRepository = await app.resolve(UserRepository);
    const user = (await userRepository.findOneBy({
      email: userCredentials.email,
    })) as User;
    await request(app.getHttpServer())
      .post('/auth/verify-email/' + user.verificationToken)
      .expect(200);
  });

  it('POST /auth/signin', async () => {
    await request(app.getHttpServer())
      .post('/auth/signIn')
      .send(userCredentials)
      .expect(200)
      .expect(({ body }) => {
        expect(body.accessToken).toBeDefined();
        accessToken = body.accessToken;
      });
  });

  it('GET /auth', async () => {
    await request(app.getHttpServer())
      .get('/auth')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(new User());
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
