import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/providers/users.service'
import { CreateAnswerDto } from '../dtos/create-answer.dto'

@Injectable()
export class AnswersService {
  constructor(
    /*
     * Inject Users Service
     */
    private readonly usersService: UsersService
  ) {}

  public createAnswer(CreateAnswerDto: CreateAnswerDto) {
    console.log(CreateAnswerDto)

    return 'Answer created'
  }
}
