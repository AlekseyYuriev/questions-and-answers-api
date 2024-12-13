import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

import jwtConfig from '../config/jwt.config';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { HashingProvider } from './hashing.provider';
import { User } from 'src/users/user.entity';
import { RefreshToken } from '../refresh-token.entity';
import { SignInDto } from '../dtos/signin.dto';

/**
 * The `SignInProvider` is responsible for handling user authentication
 * by verifying credentials, generating tokens, and managing refresh token storage.
 */
@Injectable()
export class SignInProvider {
  /**
   * Creates an instance of SignInProvider.
   * @param usersService The service for managing user-related operations.
   * @param hashingProvider The provider for hashing and comparing passwords.
   * @param generateTokensProvider The provider for generating access and refresh tokens.
   * @param refreshTokenRepository The repository for managing refresh tokens in the database.
   * @param redis The Redis client for caching tokens.
   * @param jwtConfiguration The JWT configuration settings.
   */
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
   * Authenticates a user based on the provided credentials, generates tokens,
   * and updates the refresh token in both the database and Redis cache.
   *
   * @param signInDto The user credentials for signing in.
   * @returns A promise that resolves to an object containing the access token and refresh token.
   * @throws UnauthorizedException If the password is incorrect.
   * @throws RequestTimeoutException If there is an error during password comparison or database access.
   */
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

    try {
      const existingRefreshToken = await this.refreshTokenRepository.findOne({
        where: { user: { email: signInDto.email } },
        relations: ['user'],
      });

      if (!existingRefreshToken) {
        const refreshTokenEntity = this.refreshTokenRepository.create({
          token: refreshToken,
          user: user,
        });
        await this.refreshTokenRepository.save(refreshTokenEntity);
      } else {
        existingRefreshToken.token = refreshToken;
        await this.refreshTokenRepository.save(existingRefreshToken);
      }

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
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error connecting to the database.',
      });
    }

    return { accessToken, refreshToken };
  }
}
