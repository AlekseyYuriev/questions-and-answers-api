import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';

import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';

import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

/**
 * Service responsible for managing user-related operations, such as creating and retrieving users,
 * by interacting with the Users table and delegating specific tasks to specialized providers.
 * @class
 */
@Injectable()
export class UsersService {
  /**
   * Initializes the UsersService with required dependencies.
   * @constructor
   * @param {Repository<User>} usersRepository - Repository for performing CRUD operations on the Users table.
   * @param {CreateUserProvider} createUserProvider - Provider for handling user creation logic.
   * @param {FindOneUserByEmailProvider} findOneUserByEmailProvider - Provider for retrieving a user by email.
   */
  constructor(
    /**
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /**
     * Inject createUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,

    /**
     * Inject findOneUserByEmailProvider
     */
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider
  ) {}

  /**
   * Creates a new user based on the provided details by delegating to the CreateUserProvider.
   *
   * @param {CreateUserDto} createUserDto - Data transfer object containing user details (e.g., email, password).
   * @returns {Promise<User>} A promise resolving to the newly created user entity.
   * @throws {BadRequestException} If a user with the same email already exists or input is invalid.
   * @throws {RequestTimeoutException} If there’s an error connecting to the database during creation.
   */
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * Retrieves a user by their ID, including their associated role.
   *
   * @param {string} id - The unique identifier of the user to retrieve.
   * @returns {Promise<User>} A promise resolving to the user entity with role details.
   * @throws {BadRequestException} If no user exists with the provided ID.
   * @throws {RequestTimeoutException} If there’s an error connecting to the database during retrieval.
   */
  public async findOneById(id: string): Promise<User> {
    let user = undefined;

    try {
      user = await this.usersRepository.findOne({
        where: { id: id },
        relations: { role: true },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try again later.',
        {
          description: 'Error connecting to the database.',
        }
      );
    }

    if (!user) {
      throw new BadRequestException('The user id does not exist.');
    }

    return user;
  }

  /**
   * Retrieves a user by their email by delegating to the FindOneUserByEmailProvider.
   *
   * @param {string} email - The email address of the user to retrieve.
   * @returns {Promise<User>} A promise resolving to the user entity.
   * @throws {BadRequestException} If no user exists with the provided email.
   * @throws {RequestTimeoutException} If there’s an error connecting to the database during retrieval.
   */
  public async findOneByEmail(email: string): Promise<User> {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }
}
