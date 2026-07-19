import { Module } from '@nestjs/common';
import { EnvService } from './env.sevice';

@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
