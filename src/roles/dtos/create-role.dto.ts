import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    type: 'string',
    description: 'This is role for the user',
    example: 'USER',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(96)
  @IsNotEmpty()
  value: string;
}
