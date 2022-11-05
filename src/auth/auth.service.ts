import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async postSignup(signUpDto: SignUpDto): Promise<void> {
    const { password, email } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(128).toString('hex');

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      verificationToken,
    });

    await user.save();
  }

  postLogin(): void {
    return;
  }
}
