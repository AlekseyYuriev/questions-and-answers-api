import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './providers/questions.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
  imports: [UsersModule, TypeOrmModule.forFeature([Question])],
})
export class QuestionsModule {}
