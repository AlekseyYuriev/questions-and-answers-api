import { Reflector } from '@nestjs/core';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { RoleType } from 'src/shared/auth/enums/role-type.enum';
import {
  REQUEST_USER_KEY,
  ROLE_TYPE_KEY,
} from 'src/shared/auth/constants/auth.constants';

/**
 * Guard to handle role-based access control in the application.
 * Ensures that the user has the required role to access the resource.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * The default role type assigned when no roles are explicitly specified.
   * Defaults to `RoleType.User`.
   */
  private static readonly defaultRoleType = RoleType.User;

  /**
   * Creates an instance of RolesGuard.
   * @param reflector - The reflector instance for accessing metadata from decorators.
   */
  constructor(
    /**
     * Injects the Reflector service to retrieve metadata.
     */
    private readonly reflector: Reflector
  ) {}

  /**
   * Determines whether the current user has the required role to access the resource.
   * Allows access if the `User` role is included in the required roles or if the user has the `Admin` role.
   * @param context - The execution context containing the request and response objects.
   * @returns A promise that resolves to a boolean indicating whether the user can access the route.
   * @throws UnauthorizedException If the user lacks the `Admin` role when required.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Retrieve required role types from metadata, defaulting to `RoleType.User`
    const roleTypes = this.reflector.getAllAndOverride(ROLE_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [RolesGuard.defaultRoleType];

    // Allow access if User role is explicitly included
    if (roleTypes.includes(RoleType.User)) {
      return true;
    }

    // Check if user object exists and has the Admin role
    const user = request[REQUEST_USER_KEY];

    if (!user || user.role !== RoleType.Admin) {
      throw new UnauthorizedException(
        'You do not have permission to access this resource'
      );
    }

    return true;
  }
}
