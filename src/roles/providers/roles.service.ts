import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role.entity';
import { Repository } from 'typeorm';

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
   * The method to create a new role
   */
  public async createRole(createRoleDto: CreateRoleDto) {
    let role = this.rolesRepository.create(createRoleDto);
    role = await this.rolesRepository.save(role);

    return role;
  }

  public async getRoleByValue(value: string) {
    return await this.rolesRepository.findOneBy({
      value,
    });
  }
}
