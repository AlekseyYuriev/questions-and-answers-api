import { Module } from '@nestjs/common'
import { AnswersController } from './answers.controller'
import { AnswersService } from './providers/answers.service'
import { UsersModule } from 'src/users/users.module'

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [UsersModule],
})
export class AnswersModule {}
