import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { IUser } from '@common/interfaces';
import { UserRepository } from '@common/repositories';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  getAllUsers(): string {
    return 'Hello World!';
  }
  getOneUser(userId: string): string {
    console.log(userId);
    return 'Hello World!';
  }
  async createUser(body: CreateUserDto): Promise<IUser> {
    const {
      email,
      password,
      role,
      userName,
      phoneNumber,
      gender,
      dateOfBirth,
      profilePicture,
    } = body;
    if (await this.userRepository.findOne({ filter: { email } }))
      throw new ConflictException('User already exists');

    const user = await this.userRepository.create({
      data: {
        email,
        password,
        role,
        userName,
        phoneNumber,
        gender,
        dateOfBirth,
        profilePicture,
      },
    });

    return user.toJSON();
  }
  updateUser(params: any, body: any): string {
    console.log(params, body);
    return 'Hello World!';
  }
  deleteUser(params: any): string {
    console.log(params);
    return 'Hello World!';
  }
}
