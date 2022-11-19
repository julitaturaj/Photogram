import { UnauthorizedException } from '@nestjs/common';

export class IncorrectPasswordError extends UnauthorizedException {
  constructor() {
    super('Password is incorrect.');
  }
}
