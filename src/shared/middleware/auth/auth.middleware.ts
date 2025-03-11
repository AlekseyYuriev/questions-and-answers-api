import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { REQUEST_USER_KEY } from 'src/shared/auth/constants/auth.constants';

/**
 * Middleware to authenticate requests using a JWT token from the Authorization header.
 * Verifies the token and attaches the decoded payload to the request object.
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService
  ) {}

  /**
   * Processes incoming requests to validate the JWT token.
   * @param req - The incoming HTTP request.
   * @param res - The HTTP response object.
   * @param next - The next middleware function in the stack.
   */
  use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
        error: 'No token provided',
      });
    }

    try {
      const payload = this.jwtService.verify(token);

      req[REQUEST_USER_KEY] = payload;

      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      return res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized',
        error: message,
      });
    }
  }

  /**
   * Extracts the JWT token from the Authorization header.
   * @param request - The incoming HTTP request.
   * @returns The extracted token if present and valid, otherwise undefined.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
