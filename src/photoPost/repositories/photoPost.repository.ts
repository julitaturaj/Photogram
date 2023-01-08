import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoPost } from '../entities/photo-post.entity';

@Injectable()
export class PhotoPostRepository extends Repository<PhotoPost> {
  constructor(
    @InjectRepository(PhotoPost)
    repository: Repository<PhotoPost>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
