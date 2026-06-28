import { BadRequestException, ConflictException } from '@nestjs/common';
import { HydratedDocument, Schema } from 'mongoose';
import { ProviderEnum } from '@common/enums/user';

export function commonHooksPlugin<IModel>(schema: Schema): void {
  schema.pre('validate', function () {
    if (this.password && this.provider !== ProviderEnum.SYSTEM)
      throw new ConflictException(
        'Password should not be provided for non-system providers',
      );
  });

  schema.pre(['findOne', 'find'], function () {
    const query = this.getQuery();
    if (query['paranoid'])
      this.setQuery({ deletedAt: { $exists: false }, ...query });
    else this.setQuery({ ...query });
  });

  schema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function () {
    const query = this.getQuery();
    const update = this.getUpdate() as HydratedDocument<IModel> & {
      deletedAt?: Date;
      restoredAt?: Date;
    };

    if (update.$set.length <= 1)
      throw new BadRequestException('No fields to update');
    if (update.deletedAt) {
      this.setUpdate({ $unset: { restoredAt: 1 }, ...update });
    }
    if (update.restoredAt) {
      this.setUpdate({ $unset: { deletedAt: 1 }, ...update });
      this.setQuery({ deletedAt: { $exists: true }, ...this.getQuery() });
    }
    if (query['paranoid'])
      this.setQuery({ deletedAt: { $exists: false }, ...query });
    else this.setQuery({ ...query });
  });

  schema.pre(['deleteOne', 'findOneAndDelete'], function () {
    const query = this.getQuery();
    if (query['force']) this.setQuery({ ...query });
    else this.setQuery({ deletedAt: { $exists: true }, ...query });
  });
}
