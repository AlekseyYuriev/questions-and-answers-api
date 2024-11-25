import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { Repository } from 'typeorm';
import { Question } from '../question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetQuestionsParamDto } from '../dtos/get-questions-param.dto';

@Injectable()
export class QuestionsService {
  constructor(
    /*
     * Inject Users Service
     */
    private readonly usersService: UsersService,
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

    let question = this.questionsRepository.create({
      ...createQuestionDto,
      author: author,
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
    let questions = await this.questionsRepository.find();
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
