import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Inject tagsRepository
     */
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>
  ) {}

  public async createTag(createTagDto: CreateTagDto) {
    let tag = this.tagsRepository.create(createTagDto);

    return await this.tagsRepository.save(tag);
  }
}
