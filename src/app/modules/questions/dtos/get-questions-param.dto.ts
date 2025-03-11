import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';

export class GetQuestionsParamDto {
  @ApiPropertyOptional({
    type: 'string',
    description: 'Get question with a specific id',
    example: 'bcfc6b86-c9ba-4fbb-9ca2-5658b3ddbc02',
  })
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  id?: string;
}
