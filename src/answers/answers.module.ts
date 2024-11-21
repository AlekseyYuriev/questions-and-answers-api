import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './providers/answers.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [UsersModule, TypeOrmModule.forFeature([Answer])],
})
export class AnswersModule {}
