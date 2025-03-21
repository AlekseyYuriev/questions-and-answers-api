import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleType } from 'src/shared/auth/enums/role-type.enum';

export class CreateRoleDto {
  @ApiProperty({
    enum: RoleType,
    description:
      "The role type. Possible values are 'Admin' and 'User' from the RoleType enum.",
  })
  @IsEnum(RoleType)
  @IsNotEmpty()
  role: RoleType;
}
