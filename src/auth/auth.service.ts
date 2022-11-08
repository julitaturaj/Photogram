import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEmailExistsError } from 'src/errors/UserEmailAlreadyExists.error';

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

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        throw new UserEmailExistsError();
      } else {
        throw err;
      }
    }

    // this.sendVerificationEmail();
  }

  postLogin(): void {
    return;
  }
}
