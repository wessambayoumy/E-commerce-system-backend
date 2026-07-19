import { SchemaFactory } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { commonHooksPlugin } from './common.hooks';

type Constructor<T> = new (...args: any[]) => T;

export function createSchema<T>(
  model: Constructor<T>,
  softDelete?: boolean,
): Schema<T> {
  const schema = SchemaFactory.createForClass(model);
  commonHooksPlugin(schema, softDelete);
  return schema;
}
