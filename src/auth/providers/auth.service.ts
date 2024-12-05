import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Injecting User Service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}
}
