import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './providers/roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({
    summary: 'Fetches the role by value from the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Role fetched successfully based on the query',
  })
  public getRole(@Param('value') value: string) {
    return this.rolesService.getRoleByValue(value);
  }
}
