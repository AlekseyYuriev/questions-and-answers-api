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

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultRoleType = RoleType.User;

  private readonly roleTypeGuardMap: Record<
    RoleType,
    CanActivate | CanActivate[]
  > = {
    [RoleType.User]: this.accessTokenGuard,
    [RoleType.Admin]: this.rolesGuard,
  };

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
