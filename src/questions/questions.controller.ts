import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './providers/questions.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { PatchQuestionDto } from './dtos/patch-question.dto';
import { GetQuestionsParamDto } from './dtos/get-questions-param.dto';

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
    return this.questionsService.create(createQuestionDto);
  }

  @Get('/:id?')
  @ApiOperation({
    summary: 'Fetches a list of published questions on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Questions fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the API to return',
    example: 1,
  })
  public getQuestions(
    @Param() getQuestionsParamDto: GetQuestionsParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
  ) {
    return this.questionsService.findAll(getQuestionsParamDto, limit, page);
  }

  @ApiOperation({
    summary: 'Updates an existing question',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response if the question is updated successfully',
  })
  @Patch()
  public updateQuestion(@Body() patchQuestionDto: PatchQuestionDto) {
    return this.questionsService.update(patchQuestionDto);
  }
}
