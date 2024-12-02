import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateAnswerDto } from './create-answer.dto';

export class PatchAnswerDto extends PartialType(CreateAnswerDto) {
  @ApiProperty({
    description: 'The ID of the question that needs to be updated',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
