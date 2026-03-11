import { Controller, Get, Param, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories') // API endpoint: /api/categories
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // GET /categories
  @Get()
  getAll() {
    console.log('CategoriesController: getAll called');
    return this.categoriesService.findAll();
  }

  // GET /categories/:id
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.categoriesService.findById(id);
  }

  // GET /categories/:slug
  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  // // GET /filters/category/:slug
  // @Get('/filters/category/:slug')
  // getFiltersBySlug(@Req() req: { category: Category }) {
  //   const category = req.category;
  //   return {
  //     id: category.id,
  //     name: category.name,
  //     slug: category.slug,
  //     options: category.options, // Assuming category has an 'options' relation
  //   };
  // }
}
