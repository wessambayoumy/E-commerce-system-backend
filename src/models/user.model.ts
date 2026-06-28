import { SecurityModule, SecurityService } from '@common/modules/security';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '@common/interfaces';
import { GenderEnum, ProviderEnum, RoleEnum } from '@common/enums/user';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  strict: true,
  strictQuery: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User implements IUser {
  @Prop({
    type: String,
    trim: true,
    required: true,
    minLength: 3,
    maxLength: 20,
    unique: true,
  })
  userName!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email!: string;
  @Prop({
    type: String,
    trim: true,
    select: false,
    required: function (this: User): boolean {
      return this.provider === ProviderEnum.SYSTEM;
    },
  })
  password?: string;

  @Prop({
    type: String,
    trim: true,
  })
  phoneNumber!: string;

  @Prop({
    type: Date,
  })
  dateOfBirth?: Date;

  @Prop({
    type: String,
    enum: Object.values(GenderEnum),
    default: GenderEnum.MALE,
  })
  gender: GenderEnum = GenderEnum.MALE;

  @Prop({
    type: String,
    enum: Object.values(ProviderEnum),
    default: ProviderEnum.SYSTEM,
  })
  provider: ProviderEnum = ProviderEnum.SYSTEM;

  @Prop({
    type: String,
    enum: Object.values(RoleEnum),
    default: RoleEnum.USER,
  })
  role: RoleEnum = RoleEnum.USER;

  @Prop({
    type: Date,
  })
  signOutAt!: Date;
  @Prop({
    type: Date,
  })
  createdAt!: Date;
  @Prop({
    type: Date,
  })
  updatedAt!: Date;
  @Prop({
    type: Date,
  })
  deletedAt!: Date;
  @Prop({
    type: Date,
  })
  restoredAt!: Date;
  @Prop({
    type: String,
  })
  profilePicture!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  twoFactorEnabled: boolean = false;
}
export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    imports: [SecurityModule],
    inject: [SecurityService],
    useFactory: (SecurityService: SecurityService) => {
      const schema = UserSchema;
      schema.pre('save', async function (this: HydratedDocument<User>) {
        if (this.password && this.isModified('password'))
          this.password = await SecurityService.hash(this.password);

        if (this.phoneNumber && this.isModified('phoneNumber'))
          this.phoneNumber = SecurityService.encrypt(this.phoneNumber);
      });
      return schema;
    },
  },
]);
