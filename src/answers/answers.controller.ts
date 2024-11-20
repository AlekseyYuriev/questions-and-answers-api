import { Controller } from '@nestjs/common'
import { AnswersService } from './providers/answers.service'

@Controller('answers')
export class AnswersController {
  constructor(
    /*
     * Injecting Answers Service
     */
    private readonly answersService: AnswersService
  ) {}
}
