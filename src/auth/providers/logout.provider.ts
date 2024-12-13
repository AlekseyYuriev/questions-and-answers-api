import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import jwtConfig from '../config/jwt.config';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshToken } from '../refresh-token.entity';

/**
 * The `LogoutProvider` is responsible for handling user logout operations,
 * verifying the refresh token, blacklisting the access token, and deleting the refresh token.
 */
@Injectable()
export class LogoutProvider {
  /**
   * Creates an instance of LogoutProvider.
   * @param jwtService - The service for handling JWT operations.
   * @param jwtConfiguration - The JWT configuration settings.
   * @param refreshTokenRepository - The repository for managing refresh tokens in the database.
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
     * Inject Redis
     */
    @InjectRedis()
    private readonly redis: Redis
  ) {}

  /**
   * Logs out a user by verifying the provided refresh token,
   * blacklisting the access token, and deleting the refresh token from the database.
   *
   * @param refreshTokenDto - The data transfer object containing the refresh token.
   * @returns A promise that resolves to an object containing a success message.
   * @throws UnauthorizedException If the refresh token is not found or invalid.
   * @throws HttpException If an error occurs during token verification, token retrieval, or token deletion.
   */
  public async logout(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ message: string }> {
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
      });

      if (!refreshTokenEntity) {
        throw new UnauthorizedException();
      }

      const accessToken = await this.redis.get(`user:${sub}:accessToken`);

      if (!accessToken) {
        throw new UnauthorizedException();
      }

      await this.redis.set(
        `blacklist:${accessToken}`,
        'true',
        'EX',
        this.jwtConfiguration.accessTokenTtl
      );

      await this.refreshTokenRepository.delete(refreshTokenEntity.id);

      return { message: 'Successfully logged out' };
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
