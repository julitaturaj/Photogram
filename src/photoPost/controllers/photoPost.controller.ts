import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { AuthorizedUser } from 'src/common/decorators/authorized-user.decorator';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CreatePhotoPostDto } from '../dto/create-photo-post.dto';
import { PhotoPostDto } from '../dto/photo-post.dto';
import { Comment } from '../entities/comment.entity';
import { Like } from '../entities/like.entity';
import { PhotoPost } from '../entities/photo-post.entity';
import { PhotoPostService } from '../services/photoPost.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';

@Controller('photoposts')
@ApiTags('photoposts')
export class PhotoPostController {
  constructor(private readonly photoPostService: PhotoPostService) {}

  @Post()
  @UseGuards(AuthGuard())
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (_, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The photoPost has been created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  createPost(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    photo: any,
    @Body(ValidationPipe) photoPostDto: CreatePhotoPostDto,
    @AuthorizedUser() user: JwtPayload,
  ): Promise<PhotoPost> {
    return this.photoPostService.createPhotoPost(photoPostDto, photo, user.id);
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The photoposts has been successfully fetched.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no photoposts.',
  })
  findAll(): Promise<PhotoPost[]> {
    return this.photoPostService.findAllPhotoPosts();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The photopost has been successfully fetched for given id.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no photoposts for given id.',
  })
  findOne(@Param() photoPostDto: PhotoPostDto): Promise<PhotoPost> {
    return this.photoPostService.findOnePhotoPost(photoPostDto.id);
  }

  @Get(':id/comments')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The comments has been successfully fetched for photopost.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no comments for given photopost.',
  })
  findPhotopostComments(@Param('id') photoPostId: number): Promise<Comment[]> {
    return this.photoPostService.findAllComments(photoPostId);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard())
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The comment for photoPost has been created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async createComment(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @AuthorizedUser() user: JwtPayload,
    @Param('id') photoPostId: number,
  ): Promise<Comment> {
    return this.photoPostService.createComment(
      createCommentDto,
      photoPostId,
      user.id,
    );
  }

  @Post(':id/likes')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The like for photoPost has been created.',
  })
  @ApiResponse({
    status: 204,
    description: 'The like for photoPost has been deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async likePost(
    @AuthorizedUser() user: JwtPayload,
    @Param('id') photoPostId: number,
    @Res() response: Response,
  ): Promise<Response> {
    const result = await this.photoPostService.likePost(photoPostId, user.id);
    if (result) {
      return response.status(201).send(result);
    } else {
      return response.status(204).send();
    }
  }

  @Get(':id/likes')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The likes has been successfully fetched for photopost.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no likes for given photopost.',
  })
  findPhotopostLikes(@Param('id') photoPostId: number): Promise<Like[]> {
    return this.photoPostService.findAllLikes(photoPostId);
  }
}
