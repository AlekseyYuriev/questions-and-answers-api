import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';

import { RolesService } from 'src/app/modules/roles/providers/roles.service';
import { BcryptProvider } from 'src/shared/libs/bcrypt.provider';

import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RoleType } from 'src/shared/auth/enums/role-type.enum';

/**
 * Handles the creation of new users by validating input, assigning roles,
 * hashing passwords, and persisting user data to the database.
 * @class
 */
@Injectable()
export class CreateUserProvider {
  /**
   * Initializes the CreateUserProvider with required dependencies.
   * @constructor
   * @param {RolesService} rolesService - Service for managing role-related operations, such as retrieving roles by value.
   * @param {Repository<User>} usersRepository - Repository for managing user entities in the database.
   * @param {BcryptProvider} bcryptProvider - Provider for hashing passwords using bcrypt.
   */
  constructor(
    /**
     * Inject Roles Service
     */
    private readonly rolesService: RolesService,

    /**
     * Inject usersRepository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    /**
     * Inject bcryptProvider
     */
    private readonly bcryptProvider: BcryptProvider
  ) {}

  /**
   * Creates a new user with the provided details, assigns a default role,
   * hashes the password, and saves the user to the database.
   *
   * @param {CreateUserDto} createUserDto - Data transfer object containing user details (e.g., email, password).
   * @returns {Promise<User>} A promise resolving to the newly created user entity.
   * @throws {BadRequestException} If a user with the same email already exists or the role is invalid.
   * @throws {RequestTimeoutException} If there’s an error connecting to the database during user or role retrieval or saving.
   */
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    let existingUser = undefined;
    let role = undefined;

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database',
        }
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.'
      );
    }

    try {
      role = await this.rolesService.getRoleByValue(RoleType.User);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database',
        }
      );
    }

    if (!role) {
      throw new BadRequestException('The role does not exist.');
    }

    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.bcryptProvider.hashPassword(createUserDto.password),
      role: role,
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }

    return newUser;
  }
}
