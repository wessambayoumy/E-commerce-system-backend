import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();
export const envService = {
  MONGO_URI: configService.get<string>('MONGO_URI') as string,
  PORT: Number(configService.get<string>('PORT')),
  ENCRYPTION_KEY: configService.get<string>('ENCRYPTION_KEY') as string,
  IV_LENGTH: Number(configService.get<string>('IV_LENGTH')) || 16,
  JWT_SECRET: configService.get<string>('JWT_SECRET') as string,
  JWT_EXPIRES_IN: configService.get<string>('JWT_EXPIRES_IN') as string,
  JWT_ISSUER: configService.get<string>('JWT_ISSUER') as string,
  SALT_ROUNDS: Number(configService.get<string>('SALT_ROUNDS')),
};
