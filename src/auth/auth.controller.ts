import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorizedUser } from 'src/common/decorators/authorized-user.decorator';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { VerificationAccountTokenDto } from './dto/verification-account-token.dto';
import { User } from './entities/user.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The user has successfully sign up.',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  async postSignup(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<void> {
    await this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The user has successfully signed in.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or inactive account.',
  })
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialsDto);
  }

  @Post('/verify-email/:verificationToken')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Email has been successfully verified.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid verification accout token.',
  })
  async verifyEmail(
    @Param() verificationAccountToken: VerificationAccountTokenDto,
  ): Promise<void> {
    await this.authService.verifyUser(verificationAccountToken);
  }

  @UseGuards(AuthGuard())
  @Get()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User is authorized',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'User is not authorized',
  })
  getAuth(@AuthorizedUser() user: User) {
    return user;
  }
}
