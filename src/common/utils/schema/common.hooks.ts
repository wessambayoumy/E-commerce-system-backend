import { Schema } from 'mongoose';

export function commonHooksPlugin<T>(
  schema: Schema<T>,
  softDelete: boolean = true,
): void {
  if (softDelete)
    schema.pre(
      [
        'find',
        'findOne',
        'findOneAndUpdate',
        'updateOne',
        'updateMany',
        'countDocuments',
      ],
      function () {
        const query = this.getQuery();
        const { paranoid, ...rest } = query;

        if (paranoid) this.setQuery({ ...rest, deletedAt: { $exists: false } });
        else this.setQuery(rest);
      },
    );
}
