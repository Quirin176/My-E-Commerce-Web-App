import { Controller, Get, Req } from '@nestjs/common';
import { Category } from './entities/category.entity';

@Controller('categories') // API endpoint: /categories
export class CategoriesController {
  // GET /categories
  @Get()
  getAll(@Req() req: { categories: Category[] }) {
    const categories = req.categories;
    
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));
  }

  // GET /categories/:id
  @Get(':id')
  getById(@Req() req: { category: Category }) {
    const category = req.category;
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
  }

  // GET /categories/:slug
  @Get(':slug')
  getBySlug(@Req() req: { category: Category }) {
    const category = req.category;
    
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
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
