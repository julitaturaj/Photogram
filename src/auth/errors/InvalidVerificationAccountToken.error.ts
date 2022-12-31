import { UnauthorizedException } from '@nestjs/common';

export class InvalidVerificationAccountTokenError extends UnauthorizedException {
  constructor() {
    super('Incorrect verification token.');
  }
}
