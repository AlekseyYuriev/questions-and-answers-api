import { Injectable } from '@nestjs/common';

import { SignInProvider } from './sign-in.provider';
import { SignUpProvider } from './sign-up.provider';
import { LogoutProvider } from './logout.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { SignInDto } from '../dtos/signin.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {
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
   * Public method responsible for user authentication
   */
  public async signIn(
    signInDto: SignInDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.signInProvider.signIn(signInDto);
  }

  /**
   * Public method to register a new user
   */
  public async signUp(
    signUpDto: CreateUserDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.signUpProvider.signUp(signUpDto);
  }

  /**
   * Public method to logout a user
   */
  public async logout(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ message: string }> {
    return await this.logoutProvider.logout(refreshTokenDto);
  }

  /**
   * Public method to refresh access and refresh tokens
   */
  public async refreshTokens(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
