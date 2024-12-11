import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';

import { RefreshTokensController } from './refresh-tokens.controller';
import { RefreshTokensService } from './providers/refresh-tokens.service';
import { RefreshToken } from './refresh-token.entity';

@Module({
  controllers: [RefreshTokensController],
  providers: [RefreshTokensService],
  imports: [TypeOrmModule.forFeature([RefreshToken])],
})
export class RefreshTokensModule {}
