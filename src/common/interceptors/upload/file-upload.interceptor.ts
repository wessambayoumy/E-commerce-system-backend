import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();

    const files: { buffer: Buffer; filename: string; mimetype: string }[] = [];
    const fields: Record<string, string> = {};

    for await (const part of req.parts()) {
      if (part.type === 'file')
        files.push({
          buffer: await part.toBuffer(),
          filename: part.filename,
          mimetype: part.mimetype,
        });
      else fields[part.fieldname] = part.value as string;
    }

    (req as FastifyRequest & { uploadedFiles: typeof files }).uploadedFiles =
      files;
    req.body = fields;

    return next.handle();
  }
}
