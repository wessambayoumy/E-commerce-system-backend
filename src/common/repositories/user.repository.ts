import { IUser } from '@common/interfaces';
import DBRepository from './db.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '@/models';

@Injectable()
export class UserRepository extends DBRepository<IUser> {
  constructor(@InjectModel(User.name) userModel: Model<IUser>) {
    super(userModel);
  }
}
