import { BadRequestException, Injectable } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomInt,
} from 'node:crypto';
import { envService } from '@config/env';
import { hash, compare } from 'bcrypt';
import {
  decode,
  DecodeOptions,
  Secret,
  sign,
  SignOptions,
  verify,
  VerifyOptions,
} from 'jsonwebtoken';
import { v4 } from 'uuid';
import { JwtDetails } from '@common/interfaces';

@Injectable()
export class SecurityService {
  encryptionKey = Buffer.from(envService.ENCRYPTION_KEY, 'hex');
  encrypt(text: string): string {
    const iv = randomBytes(envService.IV_LENGTH);

    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');

    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return iv.toString('hex') + ':' + encrypted + ':' + authTag.toString('hex');
  }

  decrypt(text: string): string {
    const [ivHex, encryptedText, authTagHex] = text.split(':');

    const iv = Buffer.from(ivHex, 'hex');

    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey, iv, {
      authTagLength: envService.IV_LENGTH,
    });

    decipher.setAuthTag(authTag);

    let decrypted: string = decipher.update(encryptedText, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
  }
  async hash(data: string): Promise<string> {
    const value = await hash(data, envService.SALT_ROUNDS);
    if (!value) {
      throw new BadRequestException('Hashing failed');
    }
    return value;
  }

  async compareHash(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash);
  }
  signToken(
    payload: JwtDetails,
    secret: Secret,
    options?: SignOptions,
  ): string {
    return sign(payload, secret, {
      ...options,
      jwtid: v4(),
      issuer: envService.JWT_ISSUER,
    });
  }

  verifyToken<T = JwtDetails>(
    token: string,
    secret: Secret,
    options?: VerifyOptions,
  ): T {
    return verify(token, secret, options) as T;
  }

  decode(token: string, options?: DecodeOptions) {
    return decode(token, options);
  }
  generateRandomPassword(): string {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*()-+=[]{}|;<>?,./~`';

    const allChars = upper + lower + digits + special;

    // Guarantee at least one of each required group
    const required = [
      upper[randomInt(upper.length)],
      lower[randomInt(lower.length)],
      digits[randomInt(digits.length)],
      special[randomInt(special.length)],
    ];

    // Fill remaining length (8–16), pick random length between 8–16
    const length = randomInt(8, 17);
    const rest = Array.from(
      { length: length - 4 },
      () => allChars[randomInt(allChars.length)],
    );

    // Shuffle so required chars aren't always at the start
    return [...required, ...rest].sort(() => randomInt(3) - 1).join('');
  }
}
