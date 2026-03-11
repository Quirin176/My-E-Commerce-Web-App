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
  async findAll() {
    return this.categoryRepo.find();
  }

  // Get a category's data by ID
  async findById(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  // Get a category's data by slug
  async findBySlug(slug: string) {
    const category = await this.categoryRepo.findOne({ where: { slug } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }
}
