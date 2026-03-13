import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  // Get all categories data
  async getAll() {
    const categories = await this.categoryRepo.find();
    return categories;
  }

  // Get a category's data by ID
  async getById(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  // Get a category's data by slug
  async getBySlug(slug: string) {
    const category = await this.categoryRepo.findOne({ where: { slug } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  // Get all options and all their optionvalues for a category by slug
  async getFiltersBySlug(slug: string) {
    const category = await this.categoryRepo.findOne({
      where: { slug },
      relations: ['options', 'options.optionValues'], // Assuming relations are set up
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
