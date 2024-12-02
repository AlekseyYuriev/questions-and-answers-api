import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateQuestionDto } from './create-question.dto';

export class PatchQuestionDto extends PartialType(CreateQuestionDto) {
  @ApiProperty({
    description: 'The ID of the question that needs to be updated',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
