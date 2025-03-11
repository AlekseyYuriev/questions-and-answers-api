import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleType } from 'src/shared/auth/enums/role-type.enum';

export class CreateRoleDto {
  @ApiProperty({
    enum: RoleType,
    description: "Possible values: 'user', 'admin'",
  })
  @IsEnum(RoleType)
  @IsNotEmpty()
  role: RoleType;
}
