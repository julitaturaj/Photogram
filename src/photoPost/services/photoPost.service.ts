import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CreatePhotoPostDto } from '../dto/create-photo-post.dto';
import { PhotoPost } from '../entities/photo-post.entity';
import { Comment } from '../entities/comment.entity';
import { Like } from '../entities/like.entity';
import { PostNotFoundError } from '../errors/PostNotFound.error';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PhotoPostService {
  constructor(
    @InjectRepository(PhotoPost)
    private photoPostRepository: Repository<PhotoPost>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private configService: ConfigService,
  ) {}

  createPhotoPost(
    createPhotoPostDto: CreatePhotoPostDto,
    photo: Express.Multer.File,
    userId: number,
  ): Promise<PhotoPost> {
    const appConfig = this.configService.get('app');
    const photoPath = `${appConfig.host}:${appConfig.port}/files/${photo.filename}`;

    const { title, content } = createPhotoPostDto;

    return this.photoPostRepository
      .create({
        title,
        content,
        photoPath,
        userId,
      })
      .save();
  }

  findAllPhotoPosts(): Promise<PhotoPost[]> {
    return this.photoPostRepository.find({
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

  createComment(
    createCommentDto: CreateCommentDto,
    photoPostId: number,
    userId: number,
  ): Promise<Comment> {
    const { content } = createCommentDto;
    return this.commentRepository
      .create({
        content,
        photoPostId: photoPostId,
        userId: userId,
      })
      .save();
  }

  async findAllComments(photoPostId: number): Promise<Comment[]> {
    const post = await this.photoPostRepository.findOne({
      where: { id: photoPostId },
      relations: { comments: true },
    });
    if (!post) {
      throw new PostNotFoundError();
    }
    return post.comments;
  }

  async likePost(photoPostId: number, userId: number): Promise<Like | void> {
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
    const post = await this.photoPostRepository.findOne({
      where: { id: photoPostId },
      relations: { likes: true },
    });
    if (!post) {
      throw new PostNotFoundError();
    }
    return post.likes;
  }
}
