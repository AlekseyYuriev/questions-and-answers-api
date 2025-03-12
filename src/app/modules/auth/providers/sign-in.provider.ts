import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

import jwtConfig from '../../../../config/jwt/jwt.config';
import { UsersService } from 'src/app/modules/users/providers/users.service';
import { BcryptProvider } from 'src/shared/libs/bcrypt.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

import { User } from 'src/app/modules/users/user.entity';
import { RefreshToken } from '../refresh-token.entity';
import { SignInDto } from '../dtos/signin.dto';

/**
 * Handles user authentication by verifying credentials, generating tokens,
 * and managing refresh token storage in the database and Redis cache.
 * @class
 */
@Injectable()
export class SignInProvider {
  /**
   * Initializes the SignInProvider with required dependencies.
   * @constructor
   * @param {UsersService} usersService - Service for managing user-related operations, such as finding users by email.
   * @param {BcryptProvider} bcryptProvider - Provider for password hashing and comparison using bcrypt.
   * @param {GenerateTokensProvider} generateTokensProvider - Provider for generating access and refresh tokens.
   * @param {Repository<RefreshToken>} refreshTokenRepository - Repository for managing refresh tokens in the database.
   * @param {Redis} redis - Redis client instance for caching tokens.
   * @param {ConfigType<typeof jwtConfig>} jwtConfiguration - Configuration settings for JWT, including token TTLs.
   */
  constructor(
    /**
     * Inject usersService
     */
    private readonly usersService: UsersService,

    /**
     * Inject bcryptProvider
     */
    private readonly bcryptProvider: BcryptProvider,
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
   * Authenticates a user by verifying their credentials, generates access and refresh tokens,
   * and stores the refresh token in both the database and Redis cache.
   *
   * @param {SignInDto} signInDto - Data transfer object containing the user's email and password.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} A promise resolving to an object containing the access and refresh tokens.
   * @throws {UnauthorizedException} If the provided password is incorrect.
   * @throws {RequestTimeoutException} If there’s an error during password comparison, database operations, or Redis caching.
   */
  public async signIn(
    signInDto: SignInDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user: User = await this.usersService.findOneByEmail(signInDto.email);

    let isEqual: boolean = false;

    try {
      isEqual = await this.bcryptProvider.comparePassword(
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
