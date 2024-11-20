import { Controller } from '@nestjs/common'
import { AnswersService } from './providers/answers.service'
import { ApiTags } from '@nestjs/swagger'

@Controller('answers')
@ApiTags('Answers')
export class AnswersController {
  constructor(
    /*
     * Injecting Answers Service
     */
    private readonly answersService: AnswersService
  ) {}
}
