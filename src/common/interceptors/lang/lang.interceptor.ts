import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { LangEnum } from '@common/enums/user';

@Injectable()
export class LangInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() === 'http') {
      const req = context
        .switchToHttp()
        .getRequest<FastifyRequest<{ Querystring: { lang?: string } }>>();
      const headerLang = req.headers['accept-language']
        ?.split(',')[0]
        ?.split('-')[0];

      req.lang = req.query.lang ?? req.user?.lang ?? headerLang ?? LangEnum.EN;
    }

    return next.handle();
  }
}
