import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import jwtConfig from '../config/jwt.config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshToken } from '../refresh-token.entity';

/**
 * The `RefreshTokensProvider` is responsible for handling token refresh operations,
 * generating new tokens, and managing refresh token storage.
 */
@Injectable()
export class RefreshTokensProvider {
  /**
   * Creates an instance of RefreshTokensProvider.
   * @param jwtService - The service for handling JWT operations.
   * @param jwtConfiguration - The JWT configuration settings.
   * @param refreshTokenRepository - The repository for managing refresh tokens in the database.
   * @param generateTokensProvider - The provider for generating access and refresh tokens.
   * @param usersService - The service for managing user-related operations.
   * @param redis - The Redis client for caching tokens.
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
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Inject Redis
     */
    @InjectRedis()
    private readonly redis: Redis
  ) {}

  /**
   * Refreshes authentication tokens using the provided refresh token,
   * updates the refresh token in both the database and Redis cache.
   *
   * @param refreshTokenDto - The data transfer object containing the refresh token.
   * @returns A promise that resolves to an object containing the new access token and refresh token.
   * @throws UnauthorizedException If the refresh token is not found or invalid.
   * @throws HttpException If an error occurs during token verification, user retrieval, or token storage.
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
