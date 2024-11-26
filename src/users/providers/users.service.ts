import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RolesService } from 'src/roles/providers/roles.service';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Inject RolesService
     */
    private readonly rolesService: RolesService,

    /**
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  /**
   * The method to create a new user
   */
  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    const role = await this.rolesService.getRoleByValue('USER');

    const newUser = this.usersRepository.create({
      ...createUserDto,
      role: role,
    });

    return await this.usersRepository.save(newUser);
  }

  /**
   * The method to get all the users from the database
   */
  public async findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number
  ) {
    // return [
    //   {
    //     firstName: 'John',
    //     email: 'john@doe.com',
    //   },
    //   {
    //     firstName: 'Alice',
    //     email: 'alice@doe.com',
    //   },
    // ];
    return await this.usersRepository.find();
  }

  /**
   * Find a single user using the ID of the user
   */
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({
      id,
    });
  }
}
