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
import { AuthTokenResponseDto } from '../dtos/auth-token-response.dto';

import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/app/modules/users/providers/users.service';

/**
 * @description
 * This provider handles the refresh token mechanism by validating existing refresh tokens,
 * generating new access and refresh tokens, and updating their storage in the database and Redis.
 *
 * @class RefreshTokensProvider
 */
@Injectable()
export class RefreshTokensProvider {
  /**
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
   * Also sets the new refresh token in the response cookies.
   *
   * @param {Request} req - The HTTP request object containing the refresh token in cookies.
   * @param {Response} res - The HTTP response object for setting the new refresh token cookie.
   * @returns {Promise<AuthTokenResponseDto>} A promise resolving to an object with the new access token.
   * @throws {UnauthorizedException} If the refresh token is invalid or not found in the database.
   * @throws {HttpException} If token verification fails, user retrieval fails, or there’s an error storing tokens in the database or Redis.
   */
  public async refreshTokens(
    req: Request,
    res: Response
  ): Promise<AuthTokenResponseDto> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing.');
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
        relations: ['user'],
      });

      if (!refreshTokenEntity || refreshTokenEntity.token !== refreshToken) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findOneById(sub);

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokensProvider.generateTokens(user);

      refreshTokenEntity.token = newRefreshToken;
      await this.refreshTokenRepository.save(refreshTokenEntity);

      await this.redis.set(
        `user:${user.id}:accessToken`,
        accessToken,
        'EX',
        3600 // 1 hour TTL
      );
      await this.redis.set(
        `user:${user.id}:refreshToken`,
        newRefreshToken,
        'EX',
        86400 // 24 hours TTL
      );

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        maxAge: this.jwtConfiguration.refreshTokenTtl * 1000,
      });

      return { accessToken };
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
