import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({
    description: 'This is the text of the answer',
    example: 'Try to change the connection port',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'This is rating for the answer',
    example: 7,
  })
  @IsInt()
  @Min(0)
  rating: number;

  @ApiProperty({
    description: 'The date on which the answer is published',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  createdAt: Date;

  @ApiProperty({
    description: 'The date on which the answer is updated',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  updatedAt: Date;

  @ApiProperty({
    type: 'integer',
    required: true,
    description: "That's the ID of the author of the answer",
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  authorId: number;

  @ApiProperty({
    type: 'integer',
    required: true,
    description:
      "That's the ID of the question to which the answer is published",
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  questionId: number;
}
