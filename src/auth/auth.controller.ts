import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiRequestTimeoutResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './providers/auth.service';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { SignInDto } from './dtos/signin.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthTokenResponseDto } from './dtos/auth-token-response.dto';
import { LogoutResponseDto } from './dtos/logout-response.dto';

/**
 * The `AuthController` handles authentication-related endpoints.
 *
 * Provides operations for user sign-in, sign-up, logout, and token refreshing.
 */
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  /**
   * Constructs the `AuthController` and injects dependencies.
   *
   * @param authService Service that handles authentication logic.
   */
  constructor(
    /**
     * Injecting Auth Service
     */
    private readonly authService: AuthService
  ) {}

  /**
   * Authenticates a user and returns access and refresh tokens.
   *
   * @param signInDto User credentials for signing in.
   * @returns An object containing access and refresh tokens.
   * @throws `UnauthorizedException` if credentials are invalid.
   * @throws `RequestTimeoutException` if the database connection fails.
   */
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login a registered user',
    description: 'Authenticates a user and returns access and refresh tokens.',
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
    example: 'Unauthorized.',
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    example:
      'Unable to process your request at the moment, please try again later.',
  })
  public async signIn(
    @Body() signInDto: SignInDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(signInDto);
  }

  /**
   * Registers a new user and returns access and refresh tokens.
   *
   * @param signUpDto User details for registration.
   * @returns An object containing access and refresh tokens.
   * @throws `BadRequestException` if user registration fails.
   * @throws `RequestTimeoutException` if the database connection fails.
   */
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account and returns access and refresh tokens.',
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
    example: 'The user already exists, please check your email.',
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    example:
      'Unable to process your request at the moment, please try again later.',
  })
  public async signUp(
    @Body() signUpDto: CreateUserDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signUp(signUpDto);
  }

  /**
   * Logs out a user by invalidating their refresh token.
   *
   * @param refreshTokenDto Refresh token to invalidate.
   * @returns A confirmation message.
   * @throws `UnauthorizedException` if the refresh token is invalid.
   * @throws `RequestTimeoutException` if the database connection fails.
   */
  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout a user',
    description: 'Invalidates the refresh token, logging the user out.',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token to invalidate.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully logged out.',
    type: LogoutResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials provided.',
    example: 'Unauthorized.',
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    example:
      'Unable to process your request at the moment, please try again later.',
  })
  public async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto);
  }

  /**
   * Refreshes the access and refresh tokens using a valid refresh token.
   *
   * @param refreshTokenDto Valid refresh token for generating new tokens.
   * @returns An object containing new access and refresh tokens.
   * @throws `UnauthorizedException` if the refresh token is invalid or expired.
   * @throws `RequestTimeoutException` if the database connection fails.
   */
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access and refresh tokens',
    description:
      'Generates new access and refresh tokens using the provided refresh token.',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Valid refresh token for generating new tokens.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New access and refresh tokens have been generated.',
    type: AuthTokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token.',
    example: 'Unauthorized.',
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    example:
      'Unable to process your request at the moment, please try again later.',
  })
  public async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
