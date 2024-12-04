import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { roleType } from '../enums/roleType';

@Injectable()
export class RolesService {
  constructor(
    /**
     * Injecting rolesRepository
     */
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) {}

  /**
   * Public method to create a new role
   */
  public async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const existingRole = await this.getRoleByValue(createRoleDto.role);

      if (existingRole) {
        throw new BadRequestException('Role already exists.');
      }
      const role = this.rolesRepository.create(createRoleDto);
      return await this.rolesRepository.save(role);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }
  }

  /**
   * Public method used to find one role using the value of the role
   */
  public async getRoleByValue(value: roleType): Promise<Role> {
    try {
      const role = await this.rolesRepository.findOneBy({
        role: value,
      });
      return role;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new BadRequestException("Role doesn't exist.");
      }
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }
  }
}
