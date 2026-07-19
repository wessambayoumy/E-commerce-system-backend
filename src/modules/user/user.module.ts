import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '@common/repositories';
import { UserModel } from '@/models';
import { CacheModule } from '@common/services/cache';

@Module({
  imports: [UserModel, CacheModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
