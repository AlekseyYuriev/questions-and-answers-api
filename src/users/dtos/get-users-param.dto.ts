import { IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    type: 'string',
    description: 'Get user with a specific id',
    example: 'd0cc8618-66dc-4448-8c5a-9de59c93461d',
  })
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  id?: string;
}
