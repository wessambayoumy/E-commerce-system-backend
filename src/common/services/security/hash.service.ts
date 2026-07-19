import { BadRequestException, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { EnvService } from '@config/env';

@Injectable()
export class HashService {
  constructor(private readonly envService: EnvService) {}

  async hash(data: string): Promise<string> {
    const value = await hash(data, this.envService.saltRounds);
    if (!value) throw new BadRequestException('Hashing failed');

    return value;
  }

  async compareHash(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash);
  }
}
