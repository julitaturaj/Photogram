import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'email@api.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Ab!4xxxx',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: `Password should have minimum eight characters, 
      at least one uppercase letter, one lowercase letter, one number and one special character`,
    },
  )
  password: string;
}
