import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreateAnswerDto } from '../dtos/create-answer.dto';
import { QuestionsService } from 'src/questions/providers/questions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from '../answer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnswersService {
  constructor(
    /*
     * Inject Users Service
     */
    private readonly usersService: UsersService,

    /*
     * Inject Questions Service
     */
    private readonly questionsService: QuestionsService,

    /**
     * Inject answersRepository
     */
    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>
  ) {}

  /**
   * Creating new answers
   */
  public async createAnswer(
    @Body() createAnswerDto: CreateAnswerDto
  ): Promise<Answer> {
    let author = await this.usersService.findOneById(createAnswerDto.authorId);
    delete author.password;

    let question = await this.questionsService.findOneById(
      createAnswerDto.questionId
    );

    let answer = this.answersRepository.create({
      ...createAnswerDto,
      author: author,
      question: question,
    });

    return await this.answersRepository.save(answer);
  }
}
