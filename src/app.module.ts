import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvFilePath } from './common/helper';
import { UserGroupModule } from './user-group/user-group.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        if (configService.get('NODE_ENV') === 'test') {
          const { default: mongoFakeServer } = await import(
            'test/setupMongoMemoryServer'
          );
          const uri = await mongoFakeServer.connectInMemoryMongo();
          return { uri };
        }
        return {
          uri: `mongodb://${configService.get(
            'MONGO_HOST',
          )}:${configService.get('MONGO_PORT')}/${configService.get(
            'MONGO_DBNAME',
          )}`,
        };
      },
      inject: [ConfigService],
    }),
    DbModule,
    AuthModule,
    UserModule,
    UserGroupModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
