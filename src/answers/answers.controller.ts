import { Body, Controller, Post } from '@nestjs/common'
import { AnswersService } from './providers/answers.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateAnswerDto } from './dtos/create-answer.dto'

@Controller('answers')
@ApiTags('Answers')
export class AnswersController {
  constructor(
    /*
     * Injecting Answers Service
     */
    private readonly answersService: AnswersService
  ) {}

  @Post()
  public createQuestion(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answersService.createAnswer(createAnswerDto)
  }
}
