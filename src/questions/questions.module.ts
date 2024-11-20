import { Module } from '@nestjs/common'
import { QuestionsController } from './questions.controller'
import { QuestionsService } from './providers/questions.service'
import { UsersModule } from 'src/users/users.module'

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [UsersModule],
})
export class QuestionsModule {}
