import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './providers/questions.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
  imports: [UsersModule, TagsModule, TypeOrmModule.forFeature([Question])],
})
export class QuestionsModule {}
