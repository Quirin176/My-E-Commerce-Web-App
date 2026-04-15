import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryRequest } from './dtos/categories.dtos';

@Controller('categories') // API endpoint: /api/categories
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // GET /categories - Get all categories's data (id, name, slug)
  @Get()
  getAll() {
    return this.categoriesService.getAll();
  }

  // GET /categories/id/:id - Get data from 1 category by Id (id, name, slug)
  @Get('id/:id')
  getById(@Param('id') id: number) {
    return this.categoriesService.getById(id);
  }

  // GET /categories/slug/:slug - Get data from 1 category by Slug (id, name, slug)
  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getBySlug(slug);
  }

  // POST /categories - Create a new category
  @Post()
  create(@Body() request: CreateCategoryRequest) {
    return this.categoriesService.create(request);
  }
}
