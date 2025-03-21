import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAnswerDto {
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
    type: 'integer',
    required: true,
    description: "That's the ID of the author of the answer",
    example: 'd0cc8618-66dc-4448-8c5a-9de59c93461d',
  })
  @IsNotEmpty()
  @IsUUID()
  authorId: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description:
      "That's the ID of the question to which the answer is published",
    example: 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02',
  })
  @IsNotEmpty()
  @IsUUID()
  questionId: string;
}
