import { INestApplication } from '@nestjs/common';
import { UserRepository } from '../auth/repositories/user.repository';
import { getAppInstance } from '../app.testing-module';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthService } from '../auth/services/auth.service';
import request from 'supertest';
import { PhotoPost } from './entities/photo-post.entity';
import path from 'path';
import { Comment } from './entities/comment.entity';
import { User } from 'src/auth/entities/user.entity';
import { Like } from './entities/like.entity';
describe('PhotoPost module', () => {
  let app: INestApplication;
  let accessToken: string;
  let photoPostId: Number;
  let user: User;
  let commentId: Number;
  let likeId: Number;
  const photoPostInput = {
    title: 'Title of a photopost',
    content: 'Content of a photopost',
    filePath: path.join(__dirname, '../tests/dummy-data/photo-jpg.jpg'),
  };
  const commentInput = {
    content: 'This is a comment for photopost :)',
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

    user = await userRepository
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

  it('POST /photoposts/:id/comments', async () => {
    await request(app.getHttpServer())
      .post(`/photoposts/${photoPostId}/comments`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(commentInput)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject(new Comment());
        expect(body.id).toBeDefined();
        commentId = body.id;
        expect(body.photoPostId).toEqual(photoPostId);
        expect(body.userId).toEqual(user.id);
        expect(body.content).toEqual(commentInput.content);
      });
  });

  it('GET /photoposts/:id/comments', async () => {
    await request(app.getHttpServer())
      .get(`/photoposts/${photoPostId}/comments`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .expect(({ body }) => {
        body.forEach((el: any) => {
          expect(el).toMatchObject(new Comment());
        });
        expect(
          body.some(
            (el: Comment) =>
              el.id === commentId && el.content === commentInput.content,
          ),
        );
      });
  });

  it('POST /photoposts/:id/likes', async () => {
    await request(app.getHttpServer())
      .post(`/photoposts/${photoPostId}/likes`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject(new Like());
        expect(body.id).toBeDefined();
        likeId = body.id;
        expect(body.photoPostId).toEqual(photoPostId);
        expect(body.userId).toEqual(user.id);
      });
  });

  it('GET /photoposts/:id/likes', async () => {
    await request(app.getHttpServer())
      .get(`/photoposts/${photoPostId}/likes`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .expect(({ body }) => {
        body.forEach((el: any) => {
          expect(el).toMatchObject(new Like());
        });
        expect(body.some((el: Like) => el.id === likeId));
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
