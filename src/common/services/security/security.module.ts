import { Module } from '@nestjs/common';
import { EnvModule } from '@config/env';
import { HashService } from './hash.service.js';
import { EncryptionService } from './encryption.service.js';
import { JWTService } from './jwt.service.js';

@Module({
  providers: [HashService, EncryptionService, JWTService],
  exports: [HashService, EncryptionService, JWTService],
  imports: [EnvModule],
})
export class SecurityModule {}
