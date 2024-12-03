import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    type: 'number',
    description: 'This is rating for the question',
    example: 3,
  })
  @IsInt()
  @Min(0)
  rating: number;

  @ApiProperty({
    type: 'string',
    description: "That's the title of the question",
    example: 'How to dockerize Redis in NestJS app?',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: 'string',
    description: "That's the description of the question",
    example:
      "I've addes redis service to docker-compose file, but the app is crashing when I try to up the docker",
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: 'string',
    description: 'The date on which the question is published',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    description: 'The date on which the question is updated',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  updatedAt: Date;

  @ApiPropertyOptional({
    type: 'array',
    description: 'Array of ids of tags',
    example: [
      '374fb32e-417a-4497-b677-f57e4292c76e',
      '8823fc8e-9d49-43da-ae60-735fe1949624',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    type: 'string',
    required: true,
    description: "That's the ID of the author of the question",
    example: 'd0cc8618-66dc-4448-8c5a-9de59c93461d',
  })
  @IsNotEmpty()
  @IsUUID()
  authorId: string;
}
