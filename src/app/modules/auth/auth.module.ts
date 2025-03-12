import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { Module } from '@nestjs/common';

import jwtConfig from '../../../config/jwt/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { BcryptProvider } from 'src/shared/libs/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import { LogoutProvider } from './providers/logout.provider';

import { RefreshToken } from './refresh-token.entity';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    BcryptProvider,
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
    SignUpProvider,
    LogoutProvider,
  ],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService],
})
export class AuthModule {}
