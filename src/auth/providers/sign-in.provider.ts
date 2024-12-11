import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { HashingProvider } from './hashing.provider';
import { User } from 'src/users/user.entity';
import { SignInDto } from '../dtos/signin.dto';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Inject usersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Inject hashingProvider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,

    /**
     * Inject Redis
     */
    @InjectRedis()
    private readonly redis: Redis
  ) {}

  public async signIn(
    signInDto: SignInDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user: User = await this.usersService.findOneByEmail(signInDto.email);

    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    const { accessToken, refreshToken } =
      await this.generateTokensProvider.generateTokens(user);

    await this.redis.set(
      `user:${user.id}:accessToken`,
      accessToken,
      'EX',
      3600
    );
    await this.redis.set(
      `user:${user.id}:refreshToken`,
      refreshToken,
      'EX',
      86400
    );

    return { accessToken, refreshToken };
  }
}
