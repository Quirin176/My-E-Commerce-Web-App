import { Controller, Get, Param, Req } from '@nestjs/common';
import { ProductFiltersService } from './product-filters.service';

@Controller('product-filters') // API endpoint: /api/product-filters
export class ProductFiltersController {
  constructor(private readonly productFiltersService: ProductFiltersService) { }
}
