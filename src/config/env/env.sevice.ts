import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEnvService } from './env.interface';

@Injectable()
export class EnvService implements IEnvService {
  constructor(private readonly config: ConfigService) {}

  get appName(): string {
    return this.config.getOrThrow<string>('APP_NAME');
  }
  get mongoUri(): string {
    return this.config.getOrThrow<string>('MONGO_URI');
  }

  get redisUri(): string {
    return this.config.getOrThrow<string>('REDIS_URI');
  }

  get port(): number {
    return this.config.get<number>('PORT', 3000);
  }

  get saltRounds(): number {
    return this.config.get<number>('SALT_ROUNDS', 10);
  }

  get ivLength(): number {
    return this.config.get<number>('IV_LENGTH', 16);
  }

  get encryptionKey(): string {
    return this.config.getOrThrow<string>('ENCRYPTION_KEY');
  }

  get jwtIssuer(): string {
    return this.config.getOrThrow<string>('JWT_ISSUER');
  }

  get jwtExpiryAccess(): number {
    return this.config.get<number>('JWT_EXPIRY_ACCESS', 1800);
  }

  get jwtExpiryRefresh(): number {
    return this.config.get<number>('JWT_EXPIRY_REFRESH', 31536000);
  }

  get jwtSignatureAdminAccess(): string {
    return this.config.getOrThrow<string>('JWT_SIGNATURE_ADMIN_ACCESS');
  }

  get jwtSignatureAdminRefresh(): string {
    return this.config.getOrThrow<string>('JWT_SIGNATURE_ADMIN_REFRESH');
  }

  get jwtSignatureUserAccess(): string {
    return this.config.getOrThrow<string>('JWT_SIGNATURE_USER_ACCESS');
  }

  get jwtSignatureUserRefresh(): string {
    return this.config.getOrThrow<string>('JWT_SIGNATURE_USER_REFRESH');
  }

  get emailUser(): string {
    return this.config.getOrThrow<string>('EMAIL_USER');
  }

  get emailPass(): string {
    return this.config.getOrThrow<string>('EMAIL_PASS');
  }

  get emailSecret(): string {
    return this.config.getOrThrow<string>('EMAIL_SECRET', '');
  }

  get awsAccessKeyId(): string {
    return this.config.getOrThrow<string>('AWS_ACCESS_KEY_ID');
  }

  get awsSecretAccessKey(): string {
    return this.config.getOrThrow<string>('AWS_SECRET_ACCESS_KEY');
  }

  get awsRegion(): string {
    return this.config.getOrThrow<string>('AWS_REGION');
  }

  get awsBucketName(): string {
    return this.config.getOrThrow<string>('AWS_BUCKET_NAME');
  }

  get awsPresignExpiry(): number {
    return this.config.get<number>('AWS_PRESIGN_EXPIRY', 3600);
  }

  get rateLimitCount(): number {
    return this.config.get<number>('RATE_LIMIT_COUNT', 1000);
  }

  get rateLimitTime(): number {
    return this.config.get<number>('RATE_LIMIT_TIME', 60000);
  }

  get corsOrigins(): string {
    return this.config.getOrThrow<string>('CORS_ORIGINS', '*');
  }

  get multerLimitFileSize(): number {
    return this.config.get<number>('MULTER_LIMITS_FILE_SIZE', 5242880);
  }
}
