import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class SignUpProvider {
  constructor(
    /**
     * Inject usersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

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

  public async signUp(
    signUpDto: CreateUserDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.usersService.createUser(signUpDto);

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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      const errorStatusCode =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatusCode);
    }
  }
}
