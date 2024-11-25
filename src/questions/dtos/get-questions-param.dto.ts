import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetQuestionsParamDto {
  @ApiPropertyOptional({
    description: 'Get question with a specific id',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
