import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import fastifyCsrf from '@fastify/csrf-protection';
import { ValidationPipe } from '@nestjs/common';
import { LangInterceptor, ResponseInterceptor } from '@common/interceptors';
import fastifyMultipart from '@fastify/multipart';
import { EnvService } from './config/index.js';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const envService = app.get(EnvService);

  app.enableCors({ origin: envService.corsOrigins });
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: envService.multerLimitFileSize,
      files: 5,
    },
  });
  await app.register(helmet);
  await app.register(fastifyCsrf);

  app.setGlobalPrefix('api');
  app.enableVersioning();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LangInterceptor(), new ResponseInterceptor());

  await app.listen(envService.port ?? 3000, '0.0.0.0');
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
