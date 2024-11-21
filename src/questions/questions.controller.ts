import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { QuestionsService } from './providers/questions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { PatchQuestionDto } from './dtos/patch-question.dto';

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(
    /*
     * Injecting Questions Service
     */
    private readonly questionsService: QuestionsService
  ) {}

  @ApiOperation({
    summary: 'Creates a new question',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response if your question is created successfully',
  })
  @Post()
  public createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @ApiOperation({
    summary: 'Updates an existing question',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response if the question is updated successfully',
  })
  @Patch()
  public updateQuestion(@Body() patchPostsDto: PatchQuestionDto) {
    console.log(patchPostsDto);
  }

  @Get()
  public getAllQuestions() {
    return this.questionsService.getAllQuestions();
  }
}
