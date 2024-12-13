import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { Module } from '@nestjs/common';

import { QuestionsController } from './questions.controller';
import { QuestionsService } from './providers/questions.service';
import { UsersModule } from 'src/users/users.module';
import { TagsModule } from 'src/tags/tags.module';
import { CreateQuestionProvider } from './providers/create-question.provider';
import jwtConfig from 'src/auth/config/jwt.config';
import { Question } from './question.entity';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, CreateQuestionProvider],
  exports: [QuestionsService],
  imports: [
    UsersModule,
    TagsModule,
    TypeOrmModule.forFeature([Question]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class QuestionsModule {}
