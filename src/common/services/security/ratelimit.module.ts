import { ThrottlerModule } from '@nestjs/throttler';
import { EnvModule, EnvService } from '@config/env';

export const RateLimitModule = ThrottlerModule.forRootAsync({
  imports: [EnvModule],
  useFactory: (envService: EnvService) => ({
    throttlers: [
      {
        ttl: envService.rateLimitTime,
        limit: envService.rateLimitCount,
      },
    ],
  }),
  inject: [EnvService],
});
