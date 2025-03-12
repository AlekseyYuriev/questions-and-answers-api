import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import jwtConfig from '../../../../config/jwt/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/app/modules/users/providers/users.service';

import { ActiveUserData } from '../../../../shared/auth/interfaces/active-user-data.interface';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshToken } from '../refresh-token.entity';

/**
 * Handles token refresh operations by verifying refresh tokens, generating new access
 * and refresh tokens, and managing their storage in the database and Redis cache.
 * @class
 */
@Injectable()
export class RefreshTokensProvider {
  /**
   * Initializes the RefreshTokensProvider with required dependencies.
   * @constructor
   * @param {JwtService} jwtService - Service for handling JWT operations like signing and verification.
   * @param {ConfigType<typeof jwtConfig>} jwtConfiguration - Configuration settings for JWT, including secret, audience, and issuer.
   * @param {Repository<RefreshToken>} refreshTokenRepository - Repository for managing refresh tokens in the database.
   * @param {GenerateTokensProvider} generateTokensProvider - Provider for generating access and refresh tokens.
   * @param {UsersService} usersService - Service for managing user-related operations, such as retrieving user data.
   * @param {Redis} redis - Redis client instance for caching tokens.
   */
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    /**
     * Inject refreshTokenRepository
     */
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,

    /**
     * Inject usersService
     */
    private readonly usersService: UsersService,

    /**
     * Inject Redis
     */
    @InjectRedis()
    private readonly redis: Redis
  ) {}

  /**
   * Refreshes authentication tokens by validating the provided refresh token, generating new tokens,
   * and updating their storage in both the database and Redis cache.
   *
   * @param {RefreshTokenDto} refreshTokenDto - Data transfer object containing the refresh token to validate.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} A promise resolving to an object with the new access and refresh tokens.
   * @throws {UnauthorizedException} If the refresh token is not found in the database or is invalid.
   * @throws {HttpException} If token verification fails, user retrieval fails, or there’s an error storing tokens in the database or Redis.
   */
  public async refreshTokens(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const refreshTokenEntity = await this.refreshTokenRepository.findOne({
        where: { user: { id: sub } },
        relations: ['user'],
      });

      if (!refreshTokenEntity) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findOneById(sub);

      const { accessToken, refreshToken } =
        await this.generateTokensProvider.generateTokens(user);

      refreshTokenEntity.token = refreshToken;
      await this.refreshTokenRepository.save(refreshTokenEntity);

      await this.redis.set(
        `user:${user.id}:accessToken`,
        accessToken,
        'EX',
        3600 // 1 hour TTL
      );
      await this.redis.set(
        `user:${user.id}:refreshToken`,
        refreshToken,
        'EX',
        86400 // 24 hours TTL
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
