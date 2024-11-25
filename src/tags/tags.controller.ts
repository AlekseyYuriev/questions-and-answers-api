import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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

  @ApiOperation({
    summary: 'Delete an existing tag',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if the tag was deleted successfully',
  })
  @Delete()
  public async deleteTag(@Query('id', ParseIntPipe) id: number) {
    return this.TagsService.delete(id);
  }

  @ApiOperation({
    summary: 'Soft delete an existing tag',
  })
  @ApiResponse({
    status: 200,
    description:
      'You get a 200 response if the tag was soft deleted successfully',
  })
  @Delete('soft-delete')
  public async softDeleteTag(@Query('id', ParseIntPipe) id: number) {
    return this.TagsService.softRemove(id);
  }
}
