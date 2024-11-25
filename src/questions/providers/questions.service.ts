import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { Repository } from 'typeorm';
import { Question } from '../question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetQuestionsParamDto } from '../dtos/get-questions-param.dto';
import { TagsService } from 'src/tags/providers/tags.service';

@Injectable()
export class QuestionsService {
  constructor(
    /*
     * Inject UsersService
     */
    private readonly usersService: UsersService,

    /*
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
   * Creating new questions
   */
  public async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    let author = await this.usersService.findOneById(
      createQuestionDto.authorId
    );

    let tags = await this.tagsService.findMultipleTags(createQuestionDto.tags);

    let question = this.questionsRepository.create({
      ...createQuestionDto,
      author: author,
      tags: tags,
    });

    return await this.questionsRepository.save(question);
  }

  /**
   * The method to get all the questions from the database
   */
  public async findAll(
    getQuestionsParamDto: GetQuestionsParamDto,
    limit: number,
    page: number
  ) {
    let questions = await this.questionsRepository.find({
      relations: {
        tags: true,
      },
    });
    return questions;
  }

  /**
   * Find a single question using the ID of the question
   */
  public async findOneById(id: number) {
    return await this.questionsRepository.findOneBy({
      id,
    });
  }
}
