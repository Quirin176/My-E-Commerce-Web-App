import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryRequest } from "./dtos/categories.dtos";

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

  // Create a new category
  async create(request: CreateCategoryRequest) {
    if (await this.categoryRepo.findOne({ where: { slug: request.slug } }))
      throw new ConflictException(`A category with slug '${request.slug}' already exists.`);

    // var category = this.categoryRepo.create({
    //   name: request.name,
    //   slug: request.slug
    // })

    // return await this.categoryRepo.save(category);
    return await this.categoryRepo.save(request);
  }
}
