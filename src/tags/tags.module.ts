import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { Module } from '@nestjs/common';
import { Tag } from './tag.entity';
import { TagsService } from './providers/tags.service';
import { TagsController } from './tags.controller';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  controllers: [TagsController],
  imports: [
    TypeOrmModule.forFeature([Tag]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    TagsService,
    {
      provide: AuthenticationGuard,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    RolesGuard,
  ],
  exports: [TagsService],
})
export class TagsModule {}
