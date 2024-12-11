import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    /**
     * Injecting Auth Service
     */
    private readonly authService: AuthService
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @Body() signInDto: SignInDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  public async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
