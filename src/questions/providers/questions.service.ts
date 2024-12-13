import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { CreateQuestionProvider } from './create-question.provider';
import { Question } from '../question.entity';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { GetQuestionsParamDto } from '../dtos/get-questions-param.dto';
import { PatchQuestionDto } from '../dtos/patch-question.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class QuestionsService {
  constructor(
    /**
     * Inject Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Inject Tags Service
     */
    private readonly tagsService: TagsService,

    /**
     * Inject questionsRepository
     */
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,

    /**
     * Inject createQuestionProvider
     */
    private readonly createQuestionProvider: CreateQuestionProvider
  ) {}

  /**
   * Public method responsible for creating a new question
   */
  public async create(
    createQuestionDto: CreateQuestionDto,
    user: ActiveUserData
  ): Promise<Question> {
    return await this.createQuestionProvider.create(createQuestionDto, user);
  }

  /**
   * Public method responsible for handling GET request for '/questions' endpoint
   */
  public async findAll(
    getQuestionsParamDto: GetQuestionsParamDto,
    limit: number,
    page: number
  ): Promise<Question[]> {
    let questions = undefined;

    try {
      questions = await this.questionsRepository.find({
        relations: {
          tags: true,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }

    if (!questions || questions.length <= 0) {
      throw new BadRequestException('There are no questions in the database.');
    }

    return questions;
  }

  /**
   * Public method used to find one question using the ID of the question
   */
  public async findOneById(id: string): Promise<Question> {
    let question = undefined;

    try {
      question = await this.questionsRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }

    if (!question) {
      throw new BadRequestException('The question id does not exist.');
    }

    return question;
  }

  /**
   * Public method used to update an existing questions
   */
  public async update(patchQuestionDto: PatchQuestionDto): Promise<Question> {
    let tags = undefined;
    let question = undefined;

    try {
      tags = await this.tagsService.findMultipleTags(patchQuestionDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.'
      );
    }

    if (!tags || tags.length !== patchQuestionDto.tags.length) {
      throw new BadRequestException(
        'Please check your tag IDs and ensure they are correct.'
      );
    }

    try {
      question = await this.questionsRepository.findOneBy({
        id: patchQuestionDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database',
        }
      );
    }

    if (!question) {
      throw new BadRequestException('The question does not exist.');
    }

    const updatedQuestion = Object.assign({}, question, patchQuestionDto);

    try {
      await this.questionsRepository.save(updatedQuestion);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }
    return updatedQuestion;
  }

  /**
   * Public method used to delete an existing question
   */
  public async delete(id: string): Promise<{ deleted: boolean; id: string }> {
    let question = undefined;

    try {
      question = await this.questionsRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }

    if (!question) {
      throw new BadRequestException('The question id does not exist.');
    }

    try {
      await this.questionsRepository.delete(id);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }

    return { deleted: true, id };
  }
}
