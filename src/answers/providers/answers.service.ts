import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreateAnswerDto } from '../dtos/create-answer.dto';

@Injectable()
export class AnswersService {
  constructor(
    /*
     * Inject Users Service
     */
    private readonly usersService: UsersService
  ) {}

  /**
   * Creating new answers
   */
  public createAnswer(@Body() createAnswerDto: CreateAnswerDto) {
    console.log(createAnswerDto);

    return 'Answer created';
  }
}
