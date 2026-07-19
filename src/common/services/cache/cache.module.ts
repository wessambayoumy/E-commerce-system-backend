import { Module } from '@nestjs/common';
import { EnvModule, EnvService } from '@config/env';
import { CacheService } from './cache.service';
import { createClient } from 'redis';
import { CACHE_CLIENT } from './cache.const';

@Module({
  imports: [EnvModule],
  providers: [
    CacheService,
    {
      provide: CACHE_CLIENT,
      useFactory: async (envService: EnvService) => {
        const client = createClient({ url: envService.redisUri });
        client.on('error', (err) => console.error('Redis error:', err));
        client.on('connect', () => console.log('Redis connected successfully'));
        await client.connect();
        return client;
      },
      inject: [EnvService],
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
