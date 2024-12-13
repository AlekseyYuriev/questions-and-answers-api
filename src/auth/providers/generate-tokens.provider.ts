import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';

import jwtConfig from '../config/jwt.config';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

/**
 * The `GenerateTokensProvider` is responsible for generating access and refresh tokens
 * for user authentication and managing the signing of tokens.
 */
@Injectable()
export class GenerateTokensProvider {
  /**
   * Creates an instance of GenerateTokensProvider.
   * @param jwtService - The service for handling JWT operations.
   * @param jwtConfiguration - The JWT configuration settings.
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
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  /**
   * Signs a token with the provided user ID, expiration time, and additional payload.
   * @param userId - The ID of the user.
   * @param expiresIn - The expiration time of the token in seconds.
   * @param payload - Optional additional payload to include in the token.
   * @returns A promise that resolves to the signed token string.
   * @throws RequestTimeoutException If signing the token fails.
   */
  public async signToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T
  ): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        {
          sub: userId,
          ...payload,
        },
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn: expiresIn,
        }
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Failed to sign token',
      });
    }
  }

  /**
   * Generates access and refresh tokens for the provided user.
   * @param user - The user entity for which to generate tokens.
   * @returns A promise that resolves to an object containing the access token and refresh token.
   * @throws RequestTimeoutException If generating the tokens fails.
   */
  public async generateTokens(
    user: User
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.signToken<Partial<ActiveUserData>>(
          user.id,
          this.jwtConfiguration.accessTokenTtl,
          {
            email: user.email,
            role: user.role.role,
          }
        ),

        this.signToken<Partial<ActiveUserData>>(
          user.id,
          this.jwtConfiguration.refreshTokenTtl
        ),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Failed to generate tokens',
      });
    }
  }
}
