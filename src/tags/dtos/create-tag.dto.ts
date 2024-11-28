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
    description: 'This is the name of the tag',
    example: 'javascript',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'This is the description of the tag',
    example: 'All questions javascript',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
