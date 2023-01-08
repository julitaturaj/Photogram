import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoPost } from './entities/photo-post.entity';
import { PhotoPostController } from './controllers/photoPost.controller';
import { PhotoPostService } from './services/photoPost.service';
import { AuthModule } from '../auth/auth.module';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { PhotoPostRepository } from './repositories/photoPost.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoPost, Comment, Like]), AuthModule],
  controllers: [PhotoPostController],
  providers: [PhotoPostService, PhotoPostRepository],
})
export class PhotoPostModule {}
