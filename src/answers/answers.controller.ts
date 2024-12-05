import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AnswersService } from './providers/answers.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { PatchAnswerDto } from './dtos/patch-answer.dto';
import { Answer } from './answer.entity';
import { CreateAnswerResponseDto } from './dtos/create-answer-response.dto';

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
    type: CreateAnswerResponseDto,
  })
  @ApiBody({
    required: true,
    type: CreateAnswerDto,
    description: 'Answer data to create a new answer',
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
  @ApiBody({
    required: true,
    type: CreateAnswerDto,
    description: 'Answer data to update an existing answer',
  })
  @Patch()
  public updateQuestion(@Body() patchAnswerDto: PatchAnswerDto) {
    console.log(patchAnswerDto);
  }
}
