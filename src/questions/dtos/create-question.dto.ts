import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'This is rating for the question',
    example: 3,
  })
  @IsInt()
  @Min(0)
  rating: number;

  @ApiProperty({
    description: "That's the title of the question",
    example: 'How to dockerize Redis in NestJS app?',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "That's the description of the question",
    example:
      "I've addes redis service to docker-compose file, but the app is crashing when I try to up the docker",
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The date on which the question is published',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  createdAt: Date;

  @ApiProperty({
    description: 'The date on which the question is updated',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Array of tags passed as string values',
    example: ['nestjs', 'docker', 'redis'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiProperty({
    type: 'integer',
    required: true,
    description: "That's the ID of the author of the question",
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  authorId: number;
}
