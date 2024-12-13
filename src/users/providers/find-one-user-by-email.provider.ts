import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

import { User } from '../user.entity';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    /**
     * Inject usersRepository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  public async findOneByEmail(email: string): Promise<User> {
    let user: User | undefined = undefined;

    try {
      user = await this.usersRepository.findOne({
        where: { email: email },
        relations: { role: true },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
