import { Injectable } from '@nestjs/common';

import { SignInProvider } from './sign-in.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { SignInDto } from '../dtos/signin.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject signInProvider
     */
    private readonly signInProvider: SignInProvider,

    /**
     * Inject refreshTokensProvider
     */
    private readonly refreshTokensProvider: RefreshTokensProvider
  ) {}

  public async signIn(
    signInDto: SignInDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(
    refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
