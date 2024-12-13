import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiRequestTimeoutResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { QuestionsService } from './providers/questions.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Role } from 'src/auth/decorator/role.decorator';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { Question } from './question.entity';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { PatchQuestionDto } from './dtos/patch-question.dto';
import { GetQuestionsParamDto } from './dtos/get-questions-param.dto';
import { CreateQuestionResponseDto } from './dtos/create-question-response.dto';
import { GetQuestionResponseDto } from './dtos/get-question-response.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { RoleType } from 'src/auth/enums/role-type.enum';

@Controller('questions')
@ApiTags('Questions')
export class QuestionsController {
  constructor(
    /*
     * Injecting Questions Service
     */
    private readonly questionsService: QuestionsService
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @ApiOperation({
    summary: 'Creates a new question',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response if your question is created successfully',
    type: CreateQuestionResponseDto,
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    example:
      'Unable to process your request at the moment, please try again later.',
  })
  @ApiBadRequestResponse({
    example: 'The author of the question does not exist.',
    description: 'Incorrect body values',
  })
  @ApiBody({
    required: true,
    type: CreateQuestionDto,
    description: 'Question data to create a new question',
  })
  public createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @ActiveUser() user: ActiveUserData
  ): Promise<Question> {
    return this.questionsService.create(createQuestionDto, user);
  }

  @UseGuards(AccessTokenGuard)
  @Role(RoleType.User)
  @Get('/:id?')
  @ApiOperation({
    summary: 'Fetches a list of published questions on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Questions fetched successfully based on the query',
    type: GetQuestionResponseDto,
    isArray: true,
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    example:
      'Unable to process your request at the moment, please try again later.',
  })
  @ApiBadRequestResponse({
    example: 'There are no questions in the database.',
    description: 'Incorrect query',
  })
  @ApiParam({
    name: 'questionId',
    type: GetQuestionsParamDto,
    required: false,
    description: 'The ID of the question',
    example: 'fbad309a-c386-4bf7-b8a9-9a3c3939d7cb',
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
  ): Promise<Question[]> {
    return this.questionsService.findAll(getQuestionsParamDto, limit, page);
  }

  @Patch()
  @ApiOperation({
    summary: 'Updates an existing question',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response if the question is updated successfully',
    type: CreateQuestionResponseDto,
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    example:
      'Unable to process your request at the moment, please try again later.',
  })
  @ApiBadRequestResponse({
    example: 'The author of the question does not exist.',
    description: 'Incorrect body values',
  })
  @ApiBody({
    required: true,
    type: PatchQuestionDto,
    description: 'Question data to update an existing question',
  })
  public updateQuestion(
    @Body() patchQuestionDto: PatchQuestionDto
  ): Promise<Question> {
    return this.questionsService.update(patchQuestionDto);
  }

  @Delete()
  @ApiOperation({
    summary: 'Deletes an existing question',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response if the question is deleted successfully',
    example: {
      deleted: true,
      id: 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02',
    },
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    example:
      'Unable to process your request at the moment, please try again later.',
  })
  @ApiBadRequestResponse({
    example: 'The question ID does not exist.',
    description: 'Incorrect question ID',
  })
  @ApiQuery({
    name: 'id',
    type: 'string',
    required: true,
    description: 'The ID of the question',
    example: 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02',
  })
  public deleteQuestion(
    @Query('id', ParseUUIDPipe) id: string
  ): Promise<{ deleted: boolean; id: string }> {
    return this.questionsService.delete(id);
  }
}
