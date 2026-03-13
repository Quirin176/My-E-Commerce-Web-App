import { Controller, Get, Param, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories') // API endpoint: /api/categories
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // GET /categories
  @Get()
  getAll() {
    return this.categoriesService.getAll();
  }

  // GET /categories/id/:id
  @Get('id/:id')
  getById(@Param('id') id: number) {
    return this.categoriesService.getById(id);
  }

  // GET /categories/slug/:slug
  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getBySlug(slug);
  }

  // GET /filters/category/slug/:slug
  @Get('/filters/category/slug/:slug')
  getFiltersBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getFiltersBySlug(slug);
  }
}
