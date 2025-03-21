import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import jwtConfig from '../../../../config/jwt/jwt.config';
import { ActiveUserData } from '../../../../shared/auth/interfaces/active-user-data.interface';
import { RefreshToken } from '../refresh-token.entity';

/**
 * @description
 * This provider handles user logout operations by verifying the provided refresh token,
 * removing it from the database, deleting associated tokens from the Redis cache, and clearing the refresh token cookie.
 *
 * @class LogoutProvider
 */
@Injectable()
export class LogoutProvider {
  /**
   * @constructor
   * @param {JwtService} jwtService - Service for handling JWT operations, such as token verification.
   * @param {ConfigType<typeof jwtConfig>} jwtConfiguration - Configuration settings for JWT, including secret, audience, and issuer.
   * @param {Repository<RefreshToken>} refreshTokenRepository - Repository for managing refresh tokens in the database.
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
     * Inject Redis
     */
    @InjectRedis()
    private readonly redis: Redis
  ) {}

  /**
   * Logs out a user by verifying the provided refresh token and deleting it from the database.
   * Also removes cached tokens from Redis and clears the refresh token cookie.
   *
   * @param {Request} req - The HTTP request object containing the refresh token in cookies.
   * @param {Response} res - The HTTP response object to clear the refresh token cookie.
   * @returns {Promise<Response>} A promise resolving to an HTTP response with a success message.
   * @throws {UnauthorizedException} If the refresh token is invalid or not found in the database.
   * @throws {HttpException} If an error occurs during token verification, database operations, or Redis caching.
   */
  public async logout(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedException('No refresh token provided');
      }

      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const refreshTokenEntity = await this.refreshTokenRepository.findOne({
        where: { user: { id: sub } },
      });

      if (refreshTokenEntity) {
        await this.refreshTokenRepository.delete(refreshTokenEntity.id);
      }

      await this.redis.del(`user:${sub}:accessToken`);
      await this.redis.del(`user:${sub}:refreshToken`);

      res.clearCookie('refreshToken', { httpOnly: true });

      return res.json({ message: 'Successfully logged out' });
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
