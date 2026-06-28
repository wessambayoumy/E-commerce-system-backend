import { Types } from 'mongoose';
import { RoleEnum } from '@common/enums/user';
import { JwtPayload } from 'jsonwebtoken';

export interface JwtDetails extends JwtPayload {
  userId: Types.ObjectId;
  email?: string;
  role?: RoleEnum;
}
