import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '@modules/user';
import { AuthModule } from './modules/auth';
import { ProductModule } from '@modules/product';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { envService } from '@config/env';

@Module({
  imports: [
    UserModule,
    ProductModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        uri: envService.MONGO_URI,
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('mongodb connected'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
