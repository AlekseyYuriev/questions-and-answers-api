import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';

import { QuestionsController } from './questions.controller';
import { QuestionsService } from './providers/questions.service';
import { UsersModule } from 'src/app/modules/users/users.module';
import { TagsModule } from 'src/app/modules/tags/tags.module';
import { CreateQuestionProvider } from './providers/create-question.provider';
import { Question } from './question.entity';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService, CreateQuestionProvider],
  exports: [QuestionsService],
  imports: [UsersModule, TagsModule, TypeOrmModule.forFeature([Question])],
})
export class QuestionsModule {}
