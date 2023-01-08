import { INestApplication } from '@nestjs/common';
import { UserRepository } from '../auth/repositories/user.repository';
import { getAppInstance } from '../app.testing-module';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthService } from '../auth/services/auth.service';
import request from 'supertest';
import { PhotoPost } from './entities/photo-post.entity';
import path from 'path';
describe('PhotoPost module', () => {
  let app: INestApplication;
  let accessToken: string;
  let photoPostId: Number;
  const photoPostInput = {
    title: 'Title of a photopost',
    content: 'Content of a photopost',
    filePath: path.join(__dirname, '../tests/dummy-data/photo-jpg.jpg'),
  };
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

  it('POST /photoposts', async () => {
    await request(app.getHttpServer())
      .post('/photoposts')
      .set('Authorization', 'Bearer ' + accessToken)
      .field('title', photoPostInput.title)
      .field('content', photoPostInput.content)
      .attach('file', photoPostInput.filePath)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(new PhotoPost());
        expect(body.id).toBeDefined();
        photoPostId = body.id;
      });
  });

  it('GET /photoposts', async () => {
    await request(app.getHttpServer())
      .get('/photoposts')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .expect(({ body }) => {
        body.forEach((el: any) => {
          expect(el).toMatchObject(new PhotoPost());
        });
        expect(
          body.some(
            (el: PhotoPost) =>
              el.title === photoPostInput.title &&
              el.content === photoPostInput.content &&
              el.id === photoPostId,
          ),
        );
      });
  });

  it('GET /photoposts/:id', async () => {
    await request(app.getHttpServer())
      .get('/photoposts/' + photoPostId)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject(new PhotoPost());
        expect(body.id).toEqual(photoPostId);
        expect(body.title).toEqual(photoPostInput.title);
        expect(body.content).toEqual(photoPostInput.content);
      });
  });

  it('POST /photoposts/:id/comments', () => {});

  it('GET /photoposts/:id/comments', () => {});

  it('POST /photoposts/:id/likes', () => {});

  it('GET /photoposts/:id/likes', () => {});

  afterAll(async () => {
    await app.close();
  });
});
