import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { Question } from 'src/questions/question.entity';
import { User } from 'src/users/user.entity';

export class CreateAnswerResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'This is the text of the answer',
    example: 'Try to change the connection port',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    type: 'number',
    description: 'This is rating for the answer',
    example: 7,
  })
  @IsInt()
  @Min(0)
  rating: number;

  @ApiProperty({
    type: 'string',
    description: 'The date on which the answer is published',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    description: 'The date on which the answer is updated',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  updatedAt: Date;

  @ApiProperty({
    type: User,
    required: true,
    description: "That's the author of the answer",
    example: {
      id: 'd0cc8618-66dc-4448-8c5a-9de59c93461d',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@smith.com',
    },
  })
  @IsNotEmpty()
  author: User;

  @ApiProperty({
    type: Question,
    required: true,
    description: "That's the question to which the answer is published",
    example: {
      id: 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02',
      rating: 0,
      title: 'New question 2',
      description: 'Question description for better test',
      createdAt: '2024-12-02T13:47:58.907Z',
      updatedAt: '2024-12-02T13:47:58.907Z',
    },
  })
  @IsNotEmpty()
  questionId: Question;

  @ApiProperty({
    type: 'string',
    description: 'This is the ID of the created answer',
    example: 'af9724ca-ace0-458d-866d-d124f10c1be6',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
