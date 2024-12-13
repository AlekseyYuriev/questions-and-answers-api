import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiRequestTimeoutResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { TagsService } from './providers/tags.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication/authentication.guard';
import { Role } from 'src/auth/decorator/role.decorator';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dtos/create-tag.dto';
import { CreateTagResponseDto } from './dtos/create-tag-response.dto';
import { RoleType } from 'src/auth/enums/role-type.enum';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(
    /**
     * Inject Tags Service
     */
    private readonly TagsService: TagsService
  ) {}

  /**
   * Public method responsible for creating a new tag
   */
  @Role(RoleType.Admin)
  @UseGuards(AuthenticationGuard)
  @Post()
  @ApiOperation({
    summary: 'Creates a new tag',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your tag is created successfully',
    type: CreateTagResponseDto,
  })
  @ApiBody({
    required: true,
    type: CreateTagDto,
    description: 'Tag data to create a new tag',
  })
  public createTag(@Body() createTagDto: CreateTagDto) {
    return this.TagsService.createTag(createTagDto);
  }

  @Role(RoleType.Admin)
  @UseGuards(AuthenticationGuard)
  @Delete()
  @ApiOperation({
    summary: 'Delete an existing tag',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if the tag was deleted successfully',
  })
  public async deleteTag(@Query('id', ParseUUIDPipe) id: string) {
    return this.TagsService.delete(id);
  }

  @Role(RoleType.Admin)
  @UseGuards(AuthenticationGuard)
  @Get()
  @ApiOperation({
    summary: 'Fetches a list of published tags on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Questions fetched successfully based on the query',
    type: CreateTagResponseDto,
    isArray: true,
  })
  @ApiRequestTimeoutResponse({
    description: 'Error connecting to the database',
    example:
      'Unable to process your request at the moment, please try again later.',
  })
  @ApiBadRequestResponse({
    example: 'There are no tags in the database.',
    description: 'Incorrect query',
  })
  public getQuestions(): Promise<Tag[]> {
    return this.TagsService.findAll();
  }
}
