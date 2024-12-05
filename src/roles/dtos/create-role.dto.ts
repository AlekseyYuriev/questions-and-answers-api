import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { roleType } from '../enums/roleType';

export class CreateRoleDto {
  @ApiProperty({
    enum: roleType,
    description: "Possible values: 'user', 'admin'",
  })
  @IsEnum(roleType)
  @IsNotEmpty()
  role: roleType;
}
