import {
  Body,
  Controller,
  Delete,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
@ApiTags('Tags')
export class TagsController {
  constructor(
    /**
     * Inject TagsService
     */
    private readonly TagsService: TagsService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new tag',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your tag is created successfully',
  })
  @ApiBody({
    required: true,
    type: CreateTagDto,
    description: 'Tag data to create a new tag',
  })
  public createTag(@Body() createTagDto: CreateTagDto) {
    return this.TagsService.createTag(createTagDto);
  }

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
}
