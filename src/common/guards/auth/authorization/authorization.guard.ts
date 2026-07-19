import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { RoleEnum } from '@common/enums/user';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const user = req.user;

    if (!user) throw new NotFoundException('user not found');

    const roles = this.reflector.getAllAndOverride<RoleEnum[]>(RoleEnum.NAME, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [RoleEnum.USER];

    if (!roles.includes(user.role))
      throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
