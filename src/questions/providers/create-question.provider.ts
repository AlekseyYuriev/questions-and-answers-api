import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { Question } from '../question.entity';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreateQuestionProvider {
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

  public async create(
    createQuestionDto: CreateQuestionDto,
    user: ActiveUserData
  ): Promise<Question> {
    let question = undefined;

    try {
      const [author, tags] = await Promise.all([
        this.usersService.findOneById(user.sub),
        this.tagsService.findMultipleTags(createQuestionDto.tags),
      ]);

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

      question = await this.questionsRepository.save(question);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Please check your user ID and tag IDs and ensure they are correct.'
        );
      }
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database',
        }
      );
    }

    return question;
  }
}
