import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
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

  /**
   * Creating new tags
   */
  public async createTag(createTagDto: CreateTagDto) {
    let tag = this.tagsRepository.create(createTagDto);

    return await this.tagsRepository.save(tag);
  }

  /**
   * The method to get multiple tags from the database
   */
  public async findMultipleTags(tags: number[]) {
    let results = await this.tagsRepository.find({
      where: {
        id: In(tags),
      },
    });

    return results;
  }

  /**
   * The method to delete an existing tag
   */
  public async delete(id: number) {
    await this.tagsRepository.delete(id);

    return { deleted: true, id };
  }

  /**
   * The method to soft remove an existing tag
   */
  public async softRemove(id: number) {
    await this.tagsRepository.softDelete(id);

    return { deleted: true, id };
  }
}
