import { Body, Controller, Post } from '@nestjs/common'
import { QuestionsService } from './providers/questions.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateQuestionDto } from './dtos/create-question.dto'

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(
    /*
     * Injecting Questions Service
     */
    private readonly questionsService: QuestionsService
  ) {}

  @Post()
  public createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto)
  }
}
