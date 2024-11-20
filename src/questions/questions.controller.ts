import { Controller } from '@nestjs/common'
import { QuestionsService } from './providers/questions.service'

@Controller('questions')
export class QuestionsController {
  constructor(
    /*
     * Injecting Questions Service
     */
    private readonly questionsService: QuestionsService
  ) {}
}
