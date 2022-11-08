import { ConflictException } from '@nestjs/common';

export class UserEmailExistsError extends ConflictException {
  constructor() {
    super('User with this email exists, pick a different one!');
  }
}
