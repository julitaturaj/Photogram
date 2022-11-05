import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  postSignup(signUpDto: SignUpDto): void {
    const { password, email } = signUpDto;
    console.log(email, password);
    return;
  }

  postLogin(): void {
    return;
  }
}
