import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(96)
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
