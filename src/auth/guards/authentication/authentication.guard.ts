import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccessTokenGuard } from '../access-token/access-token.guard';
import { RolesGuard } from '../roles/roles.guard';
import { RoleType } from 'src/auth/enums/role-type.enum';
import { ROLE_TYPE_KEY } from 'src/auth/constants/auth.constants';

/**
 * Guard to handle authentication and role-based access control in the application.
 * Combines access token validation and role-based authorization.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  /**
   * The default role type assigned to users.
   */
  private static readonly defaultRoleType = RoleType.User;

  /**
   * A map linking role types to their corresponding guards.
   */
  private readonly roleTypeGuardMap: Record<
    RoleType,
    CanActivate | CanActivate[]
  > = {
    [RoleType.User]: this.accessTokenGuard,
    [RoleType.Admin]: this.rolesGuard,
  };

  /**
   * Creates an instance of AuthenticationGuard.
   * @param reflector - The reflector for accessing metadata.
   * @param accessTokenGuard - The guard for validating access tokens.
   * @param rolesGuard - The guard for handling role-based authorization.
   */
  constructor(
    /**
     * Inject Reflector
     */
    private readonly reflector: Reflector,

    /**
     * Inject AccessTokenGuard
     */
    private readonly accessTokenGuard: AccessTokenGuard,

    /**
     * Inject RolesGuard
     */
    private readonly rolesGuard: RolesGuard
  ) {}

  /**
   * Determines whether the current user has the necessary authentication and role
   * to access the resource.
   * @param context - The execution context containing the request and response objects.
   * @returns A promise that resolves to a boolean indicating whether the user can activate the route.
   * @throws UnauthorizedException If the user is not authenticated or does not have the required role.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // roleTypes from reflector
    const roleTypes = this.reflector.getAllAndOverride(ROLE_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultRoleType];

    // array of guards
    const guards = roleTypes.map((type) => this.roleTypeGuardMap[type]).flat();

    const error = new UnauthorizedException();

    // Loop guards canActivate
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context)
      ).catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';

        const errorStatusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        throw new HttpException(errorMessage, errorStatusCode);
      });

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
