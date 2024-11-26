import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './providers/roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(
    /*
     * Injecting Roles Service
     */
    private readonly rolesService: RolesService
  ) {}

  @Post()
  public creteRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get('/:value')
  public getRoleByValue(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }
}
