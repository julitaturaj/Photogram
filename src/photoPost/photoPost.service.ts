import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { PhotoPost } from './entities/photo-post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';

@Injectable()
export class PhotoPostService {
  constructor(
    @InjectRepository(PhotoPost)
    private photoPostRepository: Repository<PhotoPost>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async createPhotoPost(
    createPhotoPostDto: CreatePhotoPostDto,
    userId: number,
  ): Promise<PhotoPost> {
    const { title, content } = createPhotoPostDto;
    const photoPost = this.photoPostRepository.create({
      title,
      content,
      userId,
    });

    await photoPost.save();
    return photoPost;
  }

  async findAllPhotoPosts(): Promise<PhotoPost[]> {
    return await this.photoPostRepository.find({
      relations: {
        likes: true,
      },
    });
  }

  async findOnePhotoPost(photoPostId: number): Promise<PhotoPost> {
    const foundPhotoPost = await this.photoPostRepository.findOne({
      where: {
        id: photoPostId,
      },
      relations: {
        user: true,
        comments: true,
        likes: true,
      },
    });

    if (!foundPhotoPost) {
      throw new NotFoundException(
        `PhotoPost with ID "${photoPostId}" not found`,
      );
    }

    return foundPhotoPost;
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    photoPostId: number,
    userId: number,
  ): Promise<Comment> {
    const { content } = createCommentDto;
    const comment = this.commentRepository.create({
      content,
      photoPostId: photoPostId,
      userId: userId,
    });

    await comment.save();
    return comment;
  }

  async findAllComments(photoPostId: number): Promise<Comment[]> {
    await this.findOnePhotoPost(photoPostId);
    return this.commentRepository.find({
      where: { photoPostId: photoPostId },
    });
  }

  async likePost(photoPostId: number, userId: number): Promise<Like | void> {
    this.findOnePhotoPost(photoPostId);
    const foundLike = await this.likeRepository.findOne({
      where: {
        photoPostId: photoPostId,
        userId: userId,
      },
    });

    if (foundLike) {
      foundLike.remove();
      return;
    }

    const like = this.likeRepository.create({
      photoPostId: photoPostId,
      userId: userId,
    });

    await like.save();
    return like;
  }

  async findAllLikes(photoPostId: number): Promise<Like[]> {
    await this.findOnePhotoPost(photoPostId);
    return this.likeRepository.find({
      where: { photoPostId: photoPostId },
    });
  }
}
