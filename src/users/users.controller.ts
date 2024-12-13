import { ApiTags } from '@nestjs/swagger';

import { Controller } from '@nestjs/common';

@Controller('users')
@ApiTags('Users')
export class UsersController {}
