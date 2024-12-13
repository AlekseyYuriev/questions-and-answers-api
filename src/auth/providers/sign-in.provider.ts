import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

import jwtConfig from '../config/jwt.config';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { HashingProvider } from './hashing.provider';
import { User } from 'src/users/user.entity';
import { RefreshToken } from '../refresh-token.entity';
import { SignInDto } from '../dtos/signin.dto';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Inject usersService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Inject hashingProvider
     */
    private readonly hashingProvider: HashingProvider,

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

  public async signIn(
    signInDto: SignInDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user: User = await this.usersService.findOneByEmail(signInDto.email);

    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
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

    return { accessToken, refreshToken };
  }
}
