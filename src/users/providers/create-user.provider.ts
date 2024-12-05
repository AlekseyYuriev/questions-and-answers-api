import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { roleType } from 'src/roles/enums/roleType';
import { Repository } from 'typeorm';
import { RolesService } from 'src/roles/providers/roles.service';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
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
     * Inject hashingProvider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider
  ) {}

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
      role = await this.rolesService.getRoleByValue(roleType.USER);
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
      password: await this.hashingProvider.hashPassword(createUserDto.password),
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
