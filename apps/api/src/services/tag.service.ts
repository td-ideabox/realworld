import { singleton, inject } from "tsyringe";
import type { ITagRepository } from "../repositories/tag.repository.js";

export interface ITagService {
  getAllTags(): Promise<string[]>;
  getPopularTags(limit?: number): Promise<string[]>;
}

@singleton()
export class TagService implements ITagService {
  constructor(
    @inject("ITagRepository") private tagRepository: ITagRepository
  ) {}

  async getAllTags(): Promise<string[]> {
    const tags = await this.tagRepository.findAll();
    return tags.map(tag => tag.name);
  }

  async getPopularTags(limit = 10): Promise<string[]> {
    const tags = await this.tagRepository.getMostPopular(limit);
    return tags.map(tag => tag.name);
  }
}