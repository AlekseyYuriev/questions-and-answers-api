import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { BcryptProvider } from 'src/shared/libs/bcrypt.provider';
import { RolesModule } from 'src/app/modules/roles/roles.module';

import { User } from './user.entity';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserProvider,
    FindOneUserByEmailProvider,
    BcryptProvider,
  ],
  exports: [UsersService],
  imports: [RolesModule, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
