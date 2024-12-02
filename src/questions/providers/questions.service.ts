import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { Repository } from 'typeorm';
import { Question } from '../question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetQuestionsParamDto } from '../dtos/get-questions-param.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchQuestionDto } from '../dtos/patch-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    /**
     * Inject UsersService
     */
    private readonly usersService: UsersService,

    /**
     * Inject TagsService
     */
    private readonly tagsService: TagsService,

    /**
     * Inject questionsRepository
     */
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>
  ) {}

  /**
   * Public method responsible for creating a new question
   */
  public async create(
    @Body() createQuestionDto: CreateQuestionDto
  ): Promise<Question> {
    let author = undefined;
    let tags = undefined;
    let question = undefined;

    try {
      author = await this.usersService.findOneById(createQuestionDto.authorId);
      tags = await this.tagsService.findMultipleTags(createQuestionDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database',
        }
      );
    }

    if (!author) {
      throw new BadRequestException(
        'The author of the question does not exist.'
      );
    }

    if (!tags || tags.length !== createQuestionDto.tags.length) {
      throw new BadRequestException(
        'Please check your tag IDs and ensure they are correct.'
      );
    }

    question = this.questionsRepository.create({
      ...createQuestionDto,
      author: author,
      tags: tags,
    });

    try {
      question = await this.questionsRepository.save(question);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database',
        }
      );
    }

    return question;
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

    question.title = patchQuestionDto.title ?? question.title;
    question.rating = patchQuestionDto.rating ?? question.rating;
    question.description = patchQuestionDto.description ?? question.description;
    question.createdAt = patchQuestionDto.createdAt ?? question.createdAt;
    question.updatedAt = patchQuestionDto.updatedAt ?? question.updatedAt;

    question.tags = tags;

    try {
      question = await this.questionsRepository.save(question);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }
    return question;
  }

  /**
   * Public method used to delete an existing question
   */
  public async delete(id: string): Promise<{ deleted: boolean; id: string }> {
    let question = undefined;

    try {
      console.log(id);
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
