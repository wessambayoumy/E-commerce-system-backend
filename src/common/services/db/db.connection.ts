import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule, EnvService } from '@config/env';
import { Connection } from 'mongoose';

export const DbConnection = MongooseModule.forRootAsync({
  imports: [EnvModule],
  useFactory: (envService: EnvService) => ({
    uri: envService.mongoUri,
    onConnectionCreate: (connection: Connection) => {
      connection.on('connected', () => console.log('mongodb connected'));
      return connection;
    },
  }),
  inject: [EnvService],
});
