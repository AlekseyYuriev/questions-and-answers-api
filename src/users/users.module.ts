import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { CreateUserProvider } from './providers/create-user.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CreateUserProvider],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    RolesModule,
    TypeOrmModule.forFeature([User]),
  ],
})
export class UsersModule {}
