import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserEmailExistsError } from '../errors/UserEmailAlreadyExists.error';
import { InvalidVerificationAccountTokenError } from '../errors/InvalidVerificationAccountToken.error';
import { VerificationAccountTokenDto } from '../dto/verification-account-token.dto';
import { UserNotExistsError } from '../errors/UserNotExists.error';
import { InactiveAccountError } from '../../auth/errors/InactiveAccount.error';
import { IncorrectPasswordError } from '../errors/IncorrectPassword.error';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../common/services/mail.service';
import { getSignUpMailContent } from '../email-templates/signUpEmail';
import { SignUpDto } from '../dto/sign-up.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async sendVerificationEmail(user: User, callbackUrl: string) {
    const msg = {
      to: user.email,
      from: 'julisqqa@o2.pl',
      subject: 'Photogram - confirm your account',
      html: getSignUpMailContent({
        confirmationLink:
          callbackUrl + '?verificationToken=' + user.verificationToken,
      }),
    };
    await this.mailService.sendMail(msg);
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { password, email, callbackUrl } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(128).toString('hex');

    const user = this.userRepository.create({
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

    this.sendVerificationEmail(user, callbackUrl);
  }

  async verifyUser(
    VerificationAccountTokenDto: VerificationAccountTokenDto,
  ): Promise<void> {
    const { verificationToken } = VerificationAccountTokenDto;
    const user = await this.userRepository.findOneBy({
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
    const user = await this.userRepository.findOneBy({ email: email });

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
