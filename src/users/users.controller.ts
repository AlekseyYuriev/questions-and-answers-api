import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { UsersService } from './providers/users.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.entity';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    /**
     * Injecting Users Service
     */
    private readonly usersService: UsersService
  ) {}

  @Get('/:id?')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the API to return',
    example: 1,
  })
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
  ): Promise<HttpException> {
    return this.usersService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  @ApiOperation({
    summary: 'Creates a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiBody({
    required: true,
    type: CreateUserDto,
    description: 'User data to create a new user',
  })
  public createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
