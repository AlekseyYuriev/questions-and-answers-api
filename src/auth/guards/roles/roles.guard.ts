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

/**
 * Guard to handle role-based access control in the application.
 * Ensures that the user has the required role to access the resource.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Creates an instance of RolesGuard.
   * @param jwtService - The service for handling JWT operations.
   * @param jwtConfiguration - The JWT configuration settings.
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
     * Inject Redis
     */
    @InjectRedis() private readonly redis: Redis
  ) {}

  /**
   * Determines whether the current user has the necessary role to access the resource.
   * @param context - The execution context containing the request and response objects.
   * @returns A promise that resolves to a boolean indicating whether the user can activate the route.
   * @throws UnauthorizedException If the token is missing, invalid, or the user does not have the required role.
   */
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

  /**
   * Extracts the token from the request headers.
   * @param request - The HTTP request object.
   * @returns The token string if present, otherwise undefined.
   */
  private extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
