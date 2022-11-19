import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEmailExistsError } from 'src/errors/UserEmailAlreadyExists.error';
import { InvalidVerificationAccountTokenError } from 'src/errors/InvalidVerificationAccountToken.error';
import { VerificationAccountTokenDto } from './dto/verification-account-token.dto';
import { UserNotExistsError } from 'src/errors/UserNotExists.error';
import { InactiveAccountError } from 'src/errors/InactiveAccount.error';
import { IncorrectPasswordError } from 'src/errors/IncorrectPassword.error';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async postSignup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, email } = authCredentialsDto;
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

  async verifyUser(
    VerificationAccountTokenDto: VerificationAccountTokenDto,
  ): Promise<void> {
    const { verificationToken } = VerificationAccountTokenDto;
    const user = await this.usersRepository.findOneBy({
      verificationToken: verificationToken,
    });
    if (!user) {
      throw new InvalidVerificationAccountTokenError();
    }
    user.isActive = true;
    await user.save();
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ email: email });

    if (!user) {
      throw new UserNotExistsError();
    }

    if (!user.isActive) {
      throw new InactiveAccountError();
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new IncorrectPasswordError();
    }

    const payload: JwtPayload = { id: user.id, email: user.email };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
