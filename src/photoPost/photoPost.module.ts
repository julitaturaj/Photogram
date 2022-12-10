import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoPost } from './entities/photo-post.entity';
import { PhotoPostController } from './photoPost.controller';
import { PhotoPostService } from './photoPost.service';
import { AuthModule } from '../auth/auth.module';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoPost, Comment, Like]), AuthModule],
  controllers: [PhotoPostController],
  providers: [PhotoPostService],
})
export class PhotoPostModule {}
