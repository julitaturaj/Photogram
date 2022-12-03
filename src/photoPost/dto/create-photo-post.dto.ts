import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePhotoPostDto {
  @ApiProperty({
    example: 'Title of the post',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Content of the post. More content. So much words in content.',
  })
  @IsString()
  content: string;
}
