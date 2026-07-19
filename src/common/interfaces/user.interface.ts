import {
  GenderEnum,
  LangEnum,
  ProviderEnum,
  RoleEnum,
} from '@common/enums/user';
export interface IUser {
  userName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  profilePicture?: string;
  dateOfBirth?: Date;
  gender: GenderEnum;
  provider: ProviderEnum;
  role: RoleEnum;
  lang: LangEnum;
  signOutAt: Date;
  twoFactorEnabled?: boolean;
  deletedAt: Date;
  restoredAt: Date;
}
