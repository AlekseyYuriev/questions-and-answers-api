import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { Repository } from 'typeorm';
import { Question } from '../question.entity';
import { InjectRepository } from '@nestjs/typeorm';

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

  public async getAllQuestions() {
    let questions = await this.questionsRepository.find();
    return questions;
  }
}
