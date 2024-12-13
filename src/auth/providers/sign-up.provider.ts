import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import jwtConfig from '../config/jwt.config';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { RefreshToken } from '../refresh-token.entity';

/**
 * The `SignUpProvider` is responsible for handling user registration,
 * generating authentication tokens, and managing refresh token storage.
 */
@Injectable()
export class SignUpProvider {
  /**
   * Creates an instance of SignUpProvider.
   * @param usersService - The service for managing user-related operations.
   * @param generateTokensProvider - The provider for generating access and refresh tokens.
   * @param refreshTokenRepository - The repository for managing refresh tokens in the database.
   * @param redis - The Redis client for caching tokens.
   * @param jwtConfiguration - The JWT configuration settings.
   */
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
     * Inject refreshTokenRepository
     */
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    /**
     * Inject Redis
     */
    @InjectRedis()
    private readonly redis: Redis,

    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  /**
   * Registers a new user, generates authentication tokens,
   * and updates the refresh token in both the database and Redis cache.
   *
   * @param signUpDto - The data transfer object containing user registration details.
   * @returns A promise that resolves to an object containing the access token and refresh token.
   * @throws HttpException If an error occurs during user creation, token generation, or database access.
   */
  public async signUp(
    signUpDto: CreateUserDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.usersService.createUser(signUpDto);

      const { accessToken, refreshToken } =
        await this.generateTokensProvider.generateTokens(user);

      const refreshTokenEntity = this.refreshTokenRepository.create({
        token: refreshToken,
        user: user,
      });
      await this.refreshTokenRepository.save(refreshTokenEntity);

      await this.redis.set(
        `user:${user.id}:accessToken`,
        accessToken,
        'EX',
        this.jwtConfiguration.accessTokenTtl
      );
      await this.redis.set(
        `user:${user.id}:refreshToken`,
        refreshToken,
        'EX',
        this.jwtConfiguration.refreshTokenTtl
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
