import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoPost } from './entities/photo-post.entity';
import { PhotoPostController } from './photoPost.controller';
import { PhotoPostService } from './photoPost.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PhotoPost]), AuthModule],
  controllers: [PhotoPostController],
  providers: [PhotoPostService],
})
export class PhotoPostModule {}
