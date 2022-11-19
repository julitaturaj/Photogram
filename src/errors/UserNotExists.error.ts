import { UnauthorizedException } from '@nestjs/common';

export class UserNotExistsError extends UnauthorizedException {
  constructor() {
    super('User with email not exists.');
  }
}
