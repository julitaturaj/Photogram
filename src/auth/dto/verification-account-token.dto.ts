import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class VerificationAccountTokenDto {
  @ApiProperty({
    example:
      '4d5a63613278bc998e8198c165cc5147c9151bacec557ecd22d2ce12a7614d24da899f3272ccf9546d3fa1d404c482159b2e351dd786fa238e320d242b609ce2e50764c1ed295c574b841ed7995aa842c527a3e040e90c6e3f7aab0e56734b93cdf43bde5f35fd975faa1fa47d095ce139d9b7d6f571b64bc6881725bb2fdb5b',
  })
  @IsEmail()
  verificationToken: string;
}
