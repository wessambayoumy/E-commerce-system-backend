import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  getAllUsers(): string {
    return 'Hello World!';
  }
  getOneUser(userId: string): string {
    console.log(userId);
    return 'Hello World!';
  }
  createUser(body: CreateUserDto): string {
    console.log(body);
    return 'Hello World!';
  }
  updateUser(): string {
    return 'Hello World!';
  }
  deleteUser(): string {
    return 'Hello World!';
  }
}
