import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiRequestTimeoutResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { SignInDto } from './dtos/signin.dto';
import { CreateUserDto } from 'src/app/modules/users/dtos/create-user.dto';
import { AuthTokenResponseDto } from './dtos/auth-token-response.dto';
import { LogoutResponseDto } from './dtos/logout-response.dto';

import { AuthService } from './providers/auth.service';

/**
 * The `AuthController` manages authentication-related operations,
 * such as user login, registration, logout, and token refreshing.
 */
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  /**
   * Creates an instance of `AuthController`.
   *
   * @param authService - The authentication service handling business logic.
   */
  constructor(
    /**
     * Injecting Auth Service
     */
    private readonly authService: AuthService
  ) {}

  /**
   * Authenticates a user and returns an access token.
   *
   * Upon successful authentication:
   * - An **access token** is returned in the response.
   * - A **refresh token** is securely stored in HTTP-only cookies.
   *
   * @param signInDto - User credentials for authentication.
   * @param res - The HTTP response object (sets refresh token in cookies).
   * @returns The generated access token.
   *
   * @throws {UnauthorizedException} If the credentials are invalid.
   * @throws {RequestTimeoutException} If the database connection fails.
   */
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login a registered user',
    description:
      'Authenticates a user using their credentials. Returns an access token and ' +
      'sets a refresh token in HTTP-only cookies.',
  })
  @ApiBody({
    type: SignInDto,
    description: 'User credentials for signing in.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully authenticated.',
    type: AuthTokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials provided.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized.',
      },
    },
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    schema: {
      example: {
        statusCode: 408,
        message:
          'Unable to process your request at the moment, please try again later.',
      },
    },
  })
  public async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthTokenResponseDto> {
    return this.authService.signIn(signInDto, res);
  }

  /**
   * Registers a new user and returns an access token.
   *
   * After successful registration:
   * - An **access token** is returned in the response.
   * - A **refresh token** is securely stored in HTTP-only cookies.
   *
   * @param signUpDto - User details for registration.
   * @param res - The HTTP response object (sets refresh token in cookies).
   * @returns The generated access token.
   *
   * @throws {BadRequestException} If registration data is invalid (e.g., email already exists).
   * @throws {RequestTimeoutException} If the database connection fails.
   */
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account. Returns an access token and ' +
      'sets a refresh token in HTTP-only cookies.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User details for registration.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully registered.',
    type: AuthTokenResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid registration data provided.',
    schema: {
      example: {
        statusCode: 400,
        message: 'The user already exists, please check your email.',
      },
    },
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    schema: {
      example: {
        statusCode: 408,
        message:
          'Unable to process your request at the moment, please try again later.',
      },
    },
  })
  public async signUp(
    @Body() signUpDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<AuthTokenResponseDto> {
    return this.authService.signUp(signUpDto, res);
  }

  /**
   * Logs out a user by invalidating their refresh token.
   *
   * - Removes the refresh token from the database.
   * - Clears the refresh token from HTTP-only cookies.
   *
   * @param req - The HTTP request containing the refresh token.
   * @param res - The HTTP response (clears cookies).
   * @returns A confirmation message.
   *
   * @throws {UnauthorizedException} If the refresh token is missing or invalid.
   * @throws {RequestTimeoutException} If the database connection fails.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout a user',
    description:
      'Invalidates the user session by removing the refresh token from the database ' +
      'and clearing it from HTTP-only cookies.',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully logged out.',
    type: LogoutResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized action due to missing or invalid refresh token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized.',
      },
    },
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    schema: {
      example: {
        statusCode: 408,
        message:
          'Unable to process your request at the moment, please try again later.',
      },
    },
  })
  public async logout(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    return this.authService.logout(req, res);
  }

  /**
   * Refreshes the access token using a valid refresh token stored in cookies.
   *
   * - Retrieves the refresh token from HTTP cookies.
   * - Validates the refresh token and generates a new access token.
   * - Updates the refresh token in the database.
   * - Sets the new refresh token in cookies.
   *
   * @param req - The HTTP request containing the refresh token.
   * @param res - The HTTP response (sets new refresh token in cookies).
   * @returns A new access token.
   *
   * @throws {UnauthorizedException} If the refresh token is invalid or expired.
   * @throws {RequestTimeoutException} If the database connection fails.
   */
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh the access token',
    description:
      'Generates a new access token using a valid refresh token stored in cookies. ' +
      'The refresh token is updated in the database and re-set in cookies.',
  })
  @ApiCookieAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New access token has been generated.',
    type: AuthTokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid, missing, or expired refresh token.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized.',
      },
    },
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    schema: {
      example: {
        statusCode: 408,
        message:
          'Unable to process your request at the moment, please try again later.',
      },
    },
  })
  public async refreshTokens(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<AuthTokenResponseDto> {
    return this.authService.refreshTokens(req, res);
  }
}
