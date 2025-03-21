import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './providers/answers.service';
import { UsersModule } from 'src/app/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { QuestionsModule } from 'src/app/modules/questions/questions.module';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [UsersModule, QuestionsModule, TypeOrmModule.forFeature([Answer])],
})
export class AnswersModule {}
