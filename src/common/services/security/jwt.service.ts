import { Injectable } from '@nestjs/common';
import {
  decode,
  DecodeOptions,
  Secret,
  sign,
  SignOptions,
  verify,
  VerifyOptions,
} from 'jsonwebtoken';
import { v4 } from 'uuid';
import { JwtDetails } from '@common/interfaces';
import { EnvService } from '@config/env';

@Injectable()
export class JWTService {
  constructor(private readonly envService: EnvService) {}
  signToken(
    payload: JwtDetails,
    secret: Secret,
    options?: SignOptions,
  ): string {
    return sign(payload, secret, {
      ...options,
      jwtid: v4(),
      issuer: this.envService.jwtIssuer,
    });
  }

  verifyToken<T = JwtDetails>(
    token: string,
    secret: Secret,
    options?: VerifyOptions,
  ): T {
    return verify(token, secret, options) as T;
  }

  decode(token: string, options?: DecodeOptions) {
    return decode(token, options);
  }
}
