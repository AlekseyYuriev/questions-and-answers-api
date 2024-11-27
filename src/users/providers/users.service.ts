import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
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
   * Public method responsible for creating a new user
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
      role = await this.rolesService.getRoleByValue('USER');
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

  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public async findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number
  ): Promise<HttpException> {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist.',
        fileName: 'users.service.ts',
        lineNumber: 91,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently moved.',
      }
    );
  }

  /**
   * Public method used to find one user using the ID of the user
   */
  public async findOneById(id: number): Promise<User> {
    let user = undefined;

    try {
      user = await this.usersRepository.findOneBy({
        id,
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
}
