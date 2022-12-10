import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: "I'm commenting this post.",
  })
  @IsString()
  content: string;
}
