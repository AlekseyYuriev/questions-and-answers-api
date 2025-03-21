import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';

import { Repository } from 'typeorm';
import { Response } from 'express';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import jwtConfig from '../../../../config/jwt/jwt.config';
import { RefreshToken } from '../refresh-token.entity';
import { CreateUserDto } from 'src/app/modules/users/dtos/create-user.dto';
import { AuthTokenResponseDto } from '../dtos/auth-token-response.dto';

import { UsersService } from 'src/app/modules/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';

/**
 * Handles user registration by creating a new user, generating authentication tokens,
 * and managing refresh token storage in the database and Redis cache.
 * @class
 */
@Injectable()
export class SignUpProvider {
  /**
   * @constructor
   * @param {UsersService} usersService - Service for managing user-related operations, such as creating users.
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
   * Registers a new user with the provided details, generates access and refresh tokens,
   * and stores the refresh token in both the database and Redis cache.
   *
   * @param {CreateUserDto} signUpDto - Data transfer object containing user registration details (e.g., email, password).
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<AuthTokenResponseDto>} A promise resolving to an object containing the access token.
   * @throws {HttpException} If an error occurs during user creation, token generation, database operations, or Redis caching.
   */
  public async signUp(
    signUpDto: CreateUserDto,
    res: Response
  ): Promise<AuthTokenResponseDto> {
    try {
      const user = await this.usersService.createUser(signUpDto);

      const { accessToken, refreshToken } =
        await this.generateTokensProvider.generateTokens(user);

      const refreshTokenEntity = this.refreshTokenRepository.create({
        token: refreshToken,
        user: user,
      });
      await this.refreshTokenRepository.save(refreshTokenEntity);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: this.jwtConfiguration.refreshTokenTtl * 1000,
      });

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
