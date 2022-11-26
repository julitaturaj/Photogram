import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class SignUpDto extends AuthCredentialsDto {
  @ApiProperty({
    example: 'http://fronted.com/auth/confirm-account',
  })
  @IsUrl()
  callbackUrl: string;
}
