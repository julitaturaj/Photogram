import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { AuthorizedUser } from 'src/common/decorators/authorized-user.decorator';
import { CreatePhotoPostDto } from './dto/create-photo-post.dto';
import { PhotoPost } from './entities/photo-post.entity';
import { PhotoPostService } from './photoPost.service';

@Controller('photoposts')
@ApiTags('photoposts')
export class PhotoPostController {
  constructor(private readonly wallService: PhotoPostService) {}

  @Post()
  @UseGuards(AuthGuard())
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The photoPost has been created.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async createPost(
    @Body(ValidationPipe) photoPostDto: CreatePhotoPostDto,
    @AuthorizedUser() user: JwtPayload,
  ): Promise<PhotoPost> {
    return await this.wallService.createPhotoPost(photoPostDto, user.id);
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The offers has been successfully fetched.',
  })
  @ApiResponse({
    status: 400,
    description: 'There are no offers.',
  })
  findAll(): Promise<PhotoPost[]> {
    return this.wallService.findAll();
  }
}
