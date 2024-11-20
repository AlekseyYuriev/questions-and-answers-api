import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/providers/users.service'
import { CreateQuestionDto } from '../dtos/create-question.dto'

@Injectable()
export class QuestionsService {
  constructor(
    /*
     * Inject Users Service
     */
    private readonly usersService: UsersService
  ) {}

  public createQuestion(createQuestionDto: CreateQuestionDto) {
    console.log(createQuestionDto)

    return 'Question created'
  }
}
