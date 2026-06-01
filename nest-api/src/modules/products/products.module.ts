import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { ProductFilter } from '../product-filters/entities/product-filter.entity';
import { ProductOption } from '../product-options/entities/option.entity';
import { ProductOptionValue } from '../product-option-values/entities/option-value.entity';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductFiltersModule } from '../product-filters/product-filters.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    Product,
    ProductFilter,
    ProductOptionValue,
    ProductOption
  ]),
  ProductFiltersModule
],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})

export class ProductsModule {}