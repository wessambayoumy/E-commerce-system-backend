import { ConflictException, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import nodemailer from 'nodemailer';
import { EnvService } from '@config/env';
import { CacheService } from '@common/services/cache';
import { HashService } from '@common/services/security';
import { randomInt } from 'node:crypto';
import { VerifyEmailEvent } from './email.event';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  constructor(
    private readonly envService: EnvService,
    private readonly cacheService: CacheService,
    private readonly hashService: HashService,
    private readonly event: EventEmitter2,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: envService.emailUser,
        pass: envService.emailPass,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string, text?: string) {
    await this.transporter.sendMail({
      from: this.envService.emailUser,
      to,
      subject,
      html,
      text,
    });
  }
  @OnEvent('verifyEmail')
  async verifyEmail(event: VerifyEmailEvent): Promise<void> {
    const { ex = 5, text = `this code will expire in ${ex} minutes` } =
      event.options;

    const otp = randomInt(0, 1000000).toString().padStart(6, '0');

    const setOtp = await this.cacheService.setNX({
      key: event.otpName,
      value: await this.hashService.hash(otp),
      ttl: ex * 60,
    });

    if (!setOtp) throw new ConflictException('otp name taken');

    this.event.emit('verifyEmail', {
      otpName: event.otpName,
      email: event.email,
    });

    await this.sendEmail(
      event.email,
      'Your Verification Code',
      `<h3>Your OTP code is: ${otp}</h3>`,
      text,
    );
  }
}
