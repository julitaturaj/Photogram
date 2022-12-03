import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { PhotoPost } from './entities/photo-post.entity';

@Injectable()
export class PhotoPostService {
  constructor(
    @InjectRepository(PhotoPost)
    private photoPostRepository: Repository<PhotoPost>,
  ) {}

  async createPhotoPost(
    postDto: CreatePhotoPostDto,
    userId: number,
  ): Promise<PhotoPost> {
    const { title, content } = postDto;
    const photoPost = this.photoPostRepository.create({
      title,
      content,
      userId,
    });

    await photoPost.save();
    return photoPost;
  }

  findAll(): Promise<PhotoPost[]> {
    return this.photoPostRepository.find();
  }
}
