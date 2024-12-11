import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import jwtConfig from '../config/jwt.config';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from 'src/users/providers/users.service';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokensProvider {
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

      const user = await this.usersService.findOneById(sub);

      const { accessToken, refreshToken } =
        await this.generateTokensProvider.generateTokens(user);

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
      throw new UnauthorizedException(error);
    }
  }
}
