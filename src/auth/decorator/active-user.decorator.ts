import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

/**
 * Custom decorator to retrieve the active user data from the request.
 * Can be used to get the entire user object or a specific field of the user object.
 *
 * @param field - (Optional) The specific field of the user object to retrieve.
 * @param ctx - The execution context which contains the request object.
 * @returns The entire user object or the specified field of the user object.
 *
 * @example
 * \@Get()
 * someEndpoint(@ActiveUser() user: ActiveUserData) {
 *   console.log(user);
 * }
 *
 * @example
 * \@Get()
 * someEndpoint(@ActiveUser('email') email: string) {
 *   console.log(email);
 * }
 */
export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData = request[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  }
);
