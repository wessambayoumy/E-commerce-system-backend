import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtDetails } from '@common/interfaces';
import { Types } from 'mongoose';
import { UserRepository } from '@common/repositories';
import { CacheService } from '@common/services/cache';
import { RoleEnum } from '@common/enums/user';
import { EnvService } from '@config/env';
import { JWTService } from '@common/services/security';

//TO DO: add ws
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheService: CacheService,
    private readonly jwtService: JWTService,
    private readonly envService: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token is required');
    }

    const [, token] = authHeader.split(' ');
    if (!token) throw new UnauthorizedException('Token is required');

    let payload: JwtDetails;
    try {
      const unverified = this.jwtService.decode(token) as JwtDetails;
      const secret =
        unverified?.role === RoleEnum.ADMIN
          ? this.envService.jwtSignatureAdminAccess
          : this.envService.jwtSignatureUserAccess;

      payload = this.jwtService.verifyToken<JwtDetails>(token, secret);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!Types.ObjectId.isValid(payload.userId))
      throw new UnauthorizedException('Invalid token payload');

    const user = await this.userRepository.findById({ id: payload.userId });
    if (!user) throw new UnauthorizedException("User doesn't exist");

    const revoked =
      (user.signOutAt && user.signOutAt.getTime() > payload.iat! * 1000) ||
      (await this.cacheService.get(`revokeId:${payload.jti}`));

    if (revoked) throw new UnauthorizedException('Token revoked');

    req.decoded = payload;
    req.user = user;
    return true;
  }
}
