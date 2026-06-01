import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  AdminProductFilterParams,
  CreateProductRequest,
  ProductSearchParams,
  UpdateProductRequest,
} from './dtos/products.dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('products') // API endpoint: /api/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ─── Public read endpoints ──────────────────────────────────────────────────

  /** GET /api/products/id/:id */
  @Get('id/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getById(id);
  }

  /** GET /api/products/slug/:slug */
  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.productsService.getBySlug(slug);
  }

  /** GET /api/products/newest?categoryId=1 */
  @Get('newest')
  getCategoryNewest(@Query('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsService.getCategoryNewest(categoryId);
  }

  /** GET /api/products/search?queryPhrase=...&page=1&pageSize=10&... */
  @Get('search')
  search(@Query() params: ProductSearchParams) {
    if (!params.queryPhrase?.trim()) {
      throw new NotFoundException('Search query is required');
    }
    return this.productsService.search(params);
  }

  /** GET /api/products/search/suggestions?q=...&limit=10 */
  @Get('search/suggestions')
  getSuggestions(
    @Query('q') q: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.productsService.getSuggestions(q, Number(limit));
  }

  /** GET /api/products/paginated?category=&page=1&pageSize=10&... */
  @Get('paginated')
  getPaginated(@Query() params: AdminProductFilterParams) {
    return this.productsService.getPaginated(params);
  }

  // ─── Admin write endpoints ──────────────────────────────────────────────────

  /** POST /api/products */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async create(@Body() request: CreateProductRequest) {
    const id = await this.productsService.create(request);
    return { message: 'Product Created', id };
  }

  /** PUT /api/products/:id */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateProductRequest,
  ) {
    const updated = await this.productsService.update(id, request);
    if (!updated) throw new NotFoundException('Product not found');
    return { message: 'Product updated', id };
  }

  /** DELETE /api/products/:id */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.productsService.delete(id);
    if (!deleted) throw new NotFoundException('Product not found');
    return { message: 'Product deleted' };
  }
}