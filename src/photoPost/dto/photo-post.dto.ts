import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PhotoPostDto {
  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  id: number;

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

  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  userId: number;
}
