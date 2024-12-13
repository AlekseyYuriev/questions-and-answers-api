import { Injectable } from '@nestjs/common';

import { SignInProvider } from './sign-in.provider';
import { SignUpProvider } from './sign-up.provider';
import { LogoutProvider } from './logout.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { SignInDto } from '../dtos/signin.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

/**
 * The `AuthService` is responsible for handling authentication logic.
 *
 * This service acts as a middle layer between the controller and providers,
 * delegating authentication tasks such as user login, registration, logout,
 * and token refreshing to their respective providers.
 */
@Injectable()
export class AuthService {
  /**
   * Constructs the `AuthService` and injects authentication-related providers.
   *
   * @param signInProvider Handles user authentication.
   * @param signUpProvider Handles user registration.
   * @param logoutProvider Handles user logout operations.
   * @param refreshTokensProvider Handles token refreshing.
   */
  constructor(
    /**
     * Inject signInProvider
     */
    private readonly signInProvider: SignInProvider,

    /**
     * Inject signUpProvider
     */
    private readonly signUpProvider: SignUpProvider,

    /**
     * Inject logoutProvider
     */
    private readonly logoutProvider: LogoutProvider,

    /**
     * Inject refreshTokensProvider
     */
    private readonly refreshTokensProvider: RefreshTokensProvider
  ) {}

  /**
   * Authenticates a user and generates access and refresh tokens.
   *
   * Delegates the authentication logic to the `SignInProvider`.
   *
   * @param signInDto User credentials for signing in.
   * @returns An object containing access and refresh tokens.
   * @throws `UnauthorizedException` if the credentials are invalid.
   */
  public async signIn(
    signInDto: SignInDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.signInProvider.signIn(signInDto);
  }

  /**
   * Registers a new user and generates access and refresh tokens.
   *
   * Delegates the registration logic to the `SignUpProvider`.
   *
   * @param signUpDto User details for registration.
   * @returns An object containing access and refresh tokens.
   * @throws `BadRequestException` if the registration data is invalid.
   */
  public async signUp(
    signUpDto: CreateUserDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.signUpProvider.signUp(signUpDto);
  }

  /**
   * Logs out a user by invalidating their refresh token.
   *
   * Delegates the logout logic to the `LogoutProvider`.
   *
   * @param refreshTokenDto Refresh token to invalidate.
   * @returns A message confirming the logout operation.
   * @throws `UnauthorizedException` if the provided refresh token is invalid.
   */
  public async logout(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ message: string }> {
    return await this.logoutProvider.logout(refreshTokenDto);
  }

  /**
   * Refreshes the access and refresh tokens using a valid refresh token.
   *
   * Delegates the token refreshing logic to the `RefreshTokensProvider`.
   *
   * @param refreshTokenDto Valid refresh token for generating new tokens.
   * @returns An object containing new access and refresh tokens.
   * @throws `UnauthorizedException` if the refresh token is invalid or expired.
   */
  public async refreshTokens(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
