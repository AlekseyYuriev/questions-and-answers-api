import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';

import appConfig from './config/application/app.config';
import databaseConfig from './config/typeOrm/database.config';
import environmentValidation from './config/environment.validation';
import { TypeOrmConfigService } from './config/typeOrm/typeOrmConfigService';
import { RedisConfigService } from './config/redis/redisConfigService';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    RedisModule.forRootAsync({
      useClass: RedisConfigService,
    }),
    UsersModule,
    QuestionsModule,
    AnswersModule,
    TagsModule,
    RolesModule,
    AuthModule,
    RefreshTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
