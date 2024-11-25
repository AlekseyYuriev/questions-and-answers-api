import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
export class TagsController {
  constructor(
    /**
     * Inject TagsService
     */
    private readonly TagsService: TagsService
  ) {}

  @ApiOperation({
    summary: 'Creates a new tag',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your tag is created successfully',
  })
  @Post()
  public createTag(@Body() createTagDto: CreateTagDto) {
    return this.TagsService.createTag(createTagDto);
  }
}
