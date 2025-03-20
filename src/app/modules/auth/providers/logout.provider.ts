import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import jwtConfig from '../../../../config/jwt/jwt.config';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ActiveUserData } from '../../../../shared/auth/interfaces/active-user-data.interface';
import { RefreshToken } from '../refresh-token.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

/**
 * Handles user logout operations by verifying refresh tokens and deleting them from the database.
 * @class
 */
@Injectable()
export class LogoutProvider {
  /**
   * Initializes the LogoutProvider with required dependencies.
   * @constructor
   * @param {JwtService} jwtService - Service for handling JWT operations, such as token verification.
   * @param {ConfigType<typeof jwtConfig>} jwtConfiguration - Configuration settings for JWT, including secret, audience, and issuer.
   * @param {Repository<RefreshToken>} refreshTokenRepository - Repository for managing refresh tokens in the database.
   * @param {Redis} redis - The Redis client for caching tokens.
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
   * Logs out a user by verifying the provided refresh token and deleting it from the database.
   *
   * @param {RefreshTokenDto} refreshTokenDto - Data transfer object containing the refresh token to validate.
   * @returns {Promise<{ message: string }>} A promise resolving to an object with a success message.
   * @throws {UnauthorizedException} If the refresh token is invalid or not found in the database.
   * @throws {HttpException} If an error occurs during token verification or database operations.
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

      const refreshToken = await this.redis.get(`user:${sub}:refreshToken`);

      if (!refreshToken) {
        throw new UnauthorizedException();
      }

      await this.redis.del(`user:${sub}:accessToken`);
      await this.redis.del(`user:${sub}:refreshToken`);
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
