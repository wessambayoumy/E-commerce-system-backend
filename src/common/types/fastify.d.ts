import { HydratedDocument } from 'mongoose';
import { IUser, JwtDetails } from '@common/interfaces';

declare module 'fastify' {
  interface FastifyRequest {
    user?: HydratedDocument<IUser>;
    decoded?: JwtDetails;
    lang?: string;
  }
}

export {};
