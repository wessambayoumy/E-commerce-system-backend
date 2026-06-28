import { GenderEnum, ProviderEnum, RoleEnum } from '@common/enums/user';
export interface IUser {
  userName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  profilePicture?: string;
  age?: number;
  gender: GenderEnum;
  provider: ProviderEnum;
  role: RoleEnum;
  signOutAt: Date;
  twoFactorEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  restoredAt: Date;
}
