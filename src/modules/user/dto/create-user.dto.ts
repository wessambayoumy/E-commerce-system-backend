import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderEnum, RoleEnum } from '@common/enums/user';
import { IUser } from '@common/interfaces';
export class CreateUserDto implements Partial<IUser> {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  userName!: string;
  @IsEmail()
  email!: string;
  @IsStrongPassword()
  password!: string;
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;
  @IsEnum(GenderEnum)
  gender!: GenderEnum;
  @IsDateString()
  dateOfBirth!: Date;
  @IsOptional()
  phoneNumber?: string;
  @IsOptional()
  profilePicture?: string;
}
