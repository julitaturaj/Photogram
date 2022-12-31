import { UnauthorizedException } from '@nestjs/common';

export class InactiveAccountError extends UnauthorizedException {
  constructor() {
    super('Account is inactive.');
  }
}
