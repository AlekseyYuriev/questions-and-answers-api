import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class GetQuestionsParamDto {
  @ApiPropertyOptional({
    description: 'Get question with a specific id',
    example: 1,
  })
  @IsOptional()
  @IsUUID()
  @Type(() => Number)
  id?: string;
}
