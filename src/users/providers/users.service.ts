import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RolesService } from 'src/roles/providers/roles.service';
import { roleType } from 'src/roles/enums/roleType';
import { AuthService } from 'src/auth/providers/auth.service';
import { CreateUserProvider } from './create-user.provider';

/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Inject Auth Service
     */
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /**
     * Inject Roles Service
     */
    private readonly rolesService: RolesService,

    /**
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /**
     * Inject createUserProvider
     */
    private readonly createUserProvider: CreateUserProvider
  ) {}

  /**
   * Public method responsible for creating a new user
   */
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.createUserProvider.createUser(createUserDto);
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
  public async findOneById(id: string): Promise<User> {
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
