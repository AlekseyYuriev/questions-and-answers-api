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
import { Tag } from 'src/tags/tag.entity';
import { User } from 'src/users/user.entity';

export class CreateQuestionResponseDto {
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

  @ApiPropertyOptional({
    description: 'Array of tags',
    example: [
      {
        id: '374fb32e-417a-4497-b677-f57e4292c76e',
        name: 'javascript',
        description: 'All questions javascript',
        createDate: '2024-12-02T13:54:15.904Z',
        updateDate: '2024-12-02T13:54:15.904Z',
      },
      {
        id: '8823fc8e-9d49-43da-ae60-735fe1949624',
        name: 'nestjs',
        description: 'All questions nestjs',
        createDate: '2024-12-02T13:54:15.904Z',
        updateDate: '2024-12-02T13:54:15.904Z',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: Tag[];

  @ApiProperty({
    description: 'This is the ID of the created question',
    example: '37e2e510-1d79-44c4-83d3-ea4548ad68c6',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
