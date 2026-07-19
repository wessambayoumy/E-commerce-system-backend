import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  data: T;
  Success: boolean;
  statusCode: number;
}
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T) => {
        return {
          Success: true,
          statusCode: context.switchToHttp().getResponse<Response<T>>()
            .statusCode,
          data,
        };
      }),
    );
  }
}
