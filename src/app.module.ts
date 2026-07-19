import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@modules/user';
import { AuthModule } from '@modules/auth';
import { ProductModule } from '@modules/product';
import { ConfigModule } from '@nestjs/config';
import { DbConnection } from '@/common/services/db';
import { RateLimitModule } from '@/common/services/security';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    RateLimitModule,
    UserModule,
    ProductModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod'],
      isGlobal: true,
    }),
    DbConnection,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
