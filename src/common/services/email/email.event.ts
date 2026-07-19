import { VerifyEmailOptions } from '@common/interfaces';
export class VerifyEmailEvent {
  constructor(
    public readonly otpName: string,
    public readonly email: string,
    public readonly options: VerifyEmailOptions = {},
  ) {}
}
