import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { JwtModule } from '@nestjs/jwt';

import appConfig from '../config/application/app.config';
import databaseConfig from '../config/typeOrm/database.config';
import environmentValidation from '../config/environment.validation';
import { TypeOrmConfigService } from '../config/typeOrm/typeOrmConfigService';
import { RedisConfigService } from '../config/redis/redisConfigService';
import jwtConfig from 'src/config/jwt/jwt.config';

import { UsersModule } from './modules/users/users.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { TagsModule } from './modules/tags/tags.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthMiddleware } from 'src/shared/middleware/auth/auth.middleware';

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
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/sign-in', method: RequestMethod.ALL },
        { path: 'auth/sign-up', method: RequestMethod.ALL },
        { path: 'auth/refresh-tokens', method: RequestMethod.ALL }
      )
      .forRoutes('*');
  }
}
