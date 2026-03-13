import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products') // API endpoint: /api/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // GET api/products
  @Get()
  getAll() {
    return this.productsService.getAll();
  }

  // GET api/products/categories/:id
  @Get('categories/id/:id')
  getByCategoryId(@Param('id') id: number) {
    return this.productsService.getByCategoryId(id);
  }

  // GET api/products/categories/:slug
  @Get('categories/:slug')
  getByCategorySlug(@Param('slug') slug: string) {
    return this.productsService.getByCategorySlug(slug);
  }

  // GET api/products/id/:id
  @Get('id/:id')
  getById(@Param('id') id: number) {
    return this.productsService.getById(id);
  }

  // GET api/products/slug/:slug
  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.productsService.getBySlug(slug);
  }

  // GET api/products/filters?category=slug&minPrice=0&maxPrice=1000&sortOrder=asc&options=
  @Get('/filters')
  getByFilters(
    @Query('category') category: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('sortOrder') sortOrder: string,
    @Query('options') options: string,
  ) {
    // console.log(category, { minPrice, maxPrice, sortOrder, options });
    return this.productsService.getByFilters(category, {
      minPrice: minPrice,
      maxPrice: maxPrice,
      sortOrder: sortOrder,
      options: options,
    });
  }
}
