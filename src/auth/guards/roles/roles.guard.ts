import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import jwtConfig from 'src/auth/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class RolesGuard implements CanActivate {
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
     * Inject Redis
     */
    @InjectRedis() private readonly redis: Redis
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractRequestFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration
      );

      if (payload.role !== 'admin') {
        throw new UnauthorizedException(
          'You do not have permission to access this resource'
        );
      }

      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      if (
        error instanceof UnauthorizedException &&
        error.message === 'You do not have permission to access this resource'
      ) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException();
    }

    const redisData = await this.redis.get(
      `user:${request[REQUEST_USER_KEY].sub}:accessToken`
    );

    if (!redisData) {
      throw new UnauthorizedException('Redis exception');
    }

    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
