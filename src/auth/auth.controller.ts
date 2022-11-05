import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

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
  async postSignup(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<void> {
    await this.authService.postSignup(signUpDto);
  }

  @Post('login')
  postLogin(): void {
    return this.authService.postLogin();
  }
}
