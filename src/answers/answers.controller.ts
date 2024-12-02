import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AnswersService } from './providers/answers.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { PatchAnswerDto } from './dtos/patch-answer.dto';
import { Answer } from './answer.entity';

@Controller('answers')
@ApiTags('Answers')
export class AnswersController {
  constructor(
    /*
     * Injecting Answers Service
     */
    private readonly answersService: AnswersService
  ) {}

  @ApiOperation({
    summary: 'Creates a new answer',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response if your answer is created successfully',
  })
  @Post()
  public createQuestion(
    @Body() createAnswerDto: CreateAnswerDto
  ): Promise<Answer> {
    return this.answersService.createAnswer(createAnswerDto);
  }

  @ApiOperation({
    summary: 'Updates an existing answer',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response if the answer is updated successfully',
  })
  @Patch()
  public updateQuestion(@Body() patchAnswerDto: PatchAnswerDto) {
    console.log(patchAnswerDto);
  }
}
