import { ROLE_TYPE_KEY } from '../constants/auth.constants';
import { RoleType } from '../enums/role-type.enum';
import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator to set metadata for role-based access control.
 * Allows specifying the roles required to access a resource.
 *
 * @param roleTypes - The roles that are allowed to access the resource.
 * @returns A function that sets the role metadata.
 *
 * @example
 * \@Role(RoleType.Admin)
 * \@Get('admin')
 * adminEndpoint() {
 *   // Admin-specific logic
 * }
 *
 * @example
 * \@Role(RoleType.User, RoleType.Admin)
 * \@Get('common')
 * commonEndpoint() {
 *   // Logic accessible by both users and admins
 * }
 */
export const Role = (...roleTypes: RoleType[]) =>
  SetMetadata(ROLE_TYPE_KEY, roleTypes);
