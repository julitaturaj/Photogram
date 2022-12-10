import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CommentDto {
  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: "Sooooo much words, it's a comment",
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '1',
  })
  @IsNumber()
  photoPostId: number;
}
