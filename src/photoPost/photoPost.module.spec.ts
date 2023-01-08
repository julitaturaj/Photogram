import { INestApplication } from '@nestjs/common';
import { UserRepository } from '../auth/repositories/user.repository';
import { getAppInstance } from '../app.testing-module';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthService } from '../auth/services/auth.service';
import request from 'supertest';
import { PhotoPost } from './entities/photo-post.entity';
describe('PhotoPost module', () => {
  let app: INestApplication;
  let accessToken: string;
  beforeAll(async () => {
    const credentials = {
      email: 'test@test.pl',
      password: '!QAZxsw2',
    };
    app = await getAppInstance();
    const userRepository = await app.resolve(UserRepository);
    const authService = await app.resolve(AuthService);

    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const verificationToken = crypto.randomBytes(128).toString('hex');

    await userRepository
      .create({
        email: credentials.email,
        password: hashedPassword,
        verificationToken,
        isActive: true,
      })
      .save();
    const response = await authService.signIn(credentials);
    accessToken = response.accessToken;
  });

  it('POST /photoposts', () => {});

  it('GET /photoposts', async () => {
    await request(app.getHttpServer())
      .get('/photoposts')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .expect(({ body }) => {
        body.forEach((el: any) => {
          expect(el).toMatchObject(new PhotoPost());
        });
      });
  });

  it('GET /photoposts/:id', () => {});

  it('POST /photoposts/:id/comments', () => {});

  it('GET /photoposts/:id/comments', () => {});

  it('POST /photoposts/:id/likes', () => {});

  it('GET /photoposts/:id/likes', () => {});

  afterAll(async () => {
    await app.close();
  });
});
