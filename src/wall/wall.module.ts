import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { WallController } from './wall.controller';
import { WallService } from './wall.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [WallController],
  providers: [WallService],
})
export class WallModule {}
