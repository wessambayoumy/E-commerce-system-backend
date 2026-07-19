import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { EnvService } from '@config/env';

@Injectable()
export class EncryptionService {
  private readonly encryptionKey: Buffer;
  constructor(private readonly envService: EnvService) {
    this.encryptionKey = Buffer.from(this.envService.encryptionKey, 'hex');
  }
  encrypt(text: string): string {
    const iv = randomBytes(this.envService.ivLength);

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
      authTagLength: this.envService.ivLength,
    });

    decipher.setAuthTag(authTag);

    let decrypted: string = decipher.update(encryptedText, 'hex', 'utf8');

    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
