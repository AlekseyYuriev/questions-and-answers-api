import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'This is the ID of the created tag',
    example: 'b0df2323-fb82-473d-8846-8cf5c0b25b98',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    type: 'string',
    description: 'This is the name of the tag',
    example: 'javascript',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'This is the description of the tag',
    example: 'All questions javascript',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'string',
    description: 'The date on which the tag is published',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  createDate: Date;

  @ApiProperty({
    type: 'string',
    description: 'The date on which the tag is updated',
    example: '2024-11-20T14:20:41.117Z',
  })
  @IsISO8601()
  updateDate: Date;
}
