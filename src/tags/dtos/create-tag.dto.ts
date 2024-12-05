import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
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
}
