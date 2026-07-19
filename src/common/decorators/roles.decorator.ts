import { RoleEnum } from '@common/enums/user';
import { SetMetadata } from '@nestjs/common';
export const Roles = (roles: RoleEnum[]) => SetMetadata(RoleEnum.NAME, roles);
