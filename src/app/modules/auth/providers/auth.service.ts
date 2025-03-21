import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

import { SignInProvider } from './sign-in.provider';
import { SignUpProvider } from './sign-up.provider';
import { LogoutProvider } from './logout.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';

import { SignInDto } from '../dtos/signin.dto';
import { CreateUserDto } from 'src/app/modules/users/dtos/create-user.dto';
import { AuthTokenResponseDto } from '../dtos/auth-token-response.dto';

/**
 * @description
 * The `AuthService` handles authentication-related operations by acting as an intermediary
 * between the controller and authentication providers. It delegates authentication tasks
 * such as user login, registration, logout, and token refreshing to their respective providers.
 *
 * @class AuthService
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
   * Authenticates a user and generates authentication tokens.
   *
   * This method delegates the authentication logic to `SignInProvider`.
   * If authentication is successful, it returns an access token in the response body
   * and stores a refresh token in HTTP-only cookies.
   *
   * @param {SignInDto} signInDto - User credentials for signing in.
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<AuthTokenResponseDto>} An object containing the access token.
   * @throws {UnauthorizedException} If the credentials are invalid.
   */
  public async signIn(
    signInDto: SignInDto,
    res: Response
  ): Promise<AuthTokenResponseDto> {
    return await this.signInProvider.signIn(signInDto, res);
  }

  /**
   * Registers a new user and generates authentication tokens.
   *
   * This method delegates the registration logic to `SignUpProvider`.
   * If registration is successful, it returns an access token in the response body
   * and stores a refresh token in HTTP-only cookies.
   *
   * @param {CreateUserDto} signUpDto - User details for registration.
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<AuthTokenResponseDto>} An object containing the access token.
   * @throws {BadRequestException} If the registration data is invalid.
   */
  public async signUp(
    signUpDto: CreateUserDto,
    res: Response
  ): Promise<AuthTokenResponseDto> {
    return await this.signUpProvider.signUp(signUpDto, res);
  }

  /**
   * Logs out a user by invalidating their refresh token.
   *
   * This method delegates the logout logic to `LogoutProvider`.
   * It removes the refresh token from the database and clears it from cookies.
   *
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<Response>} A response confirming successful logout.
   * @throws {UnauthorizedException} If the provided refresh token is invalid.
   */
  public async logout(req: Request, res: Response): Promise<Response> {
    return await this.logoutProvider.logout(req, res);
  }

  /**
   * Refreshes the authentication tokens using a valid refresh token.
   *
   * This method delegates the token refreshing logic to `RefreshTokensProvider`.
   * If successful, it generates and returns a new access token.
   *
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<{ accessToken: string }>} An object containing the new access token.
   * @throws {UnauthorizedException} If the refresh token is invalid or expired.
   */
  public async refreshTokens(
    req: Request,
    res: Response
  ): Promise<{ accessToken: string }> {
    return await this.refreshTokensProvider.refreshTokens(req, res);
  }
}
