import { Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/providers/users.service'

@Injectable()
export class AnswersService {
  constructor(
    /*
     * Inject Users Service
     */
    private readonly usersService: UsersService
  ) {}
}
