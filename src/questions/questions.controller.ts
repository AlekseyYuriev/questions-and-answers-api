import { Controller } from '@nestjs/common'
import { QuestionsService } from './providers/questions.service'
import { ApiTags } from '@nestjs/swagger'

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(
    /*
     * Injecting Questions Service
     */
    private readonly questionsService: QuestionsService
  ) {}
}
