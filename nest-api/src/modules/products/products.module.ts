import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesModule } from '../categories/categories.module';
import { ProductFiltersModule } from '../product-filters/product-filters.module';
import { ProductFilter } from '../product-filters/entities/product-filter.entity';
import { ProductOptionValue } from '../product-option-values/entities/option-value.entity';
import { ProductOption } from '../product-options/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductFilter, ProductOptionValue, ProductOption]), CategoriesModule, ProductFiltersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})

export class ProductsModule {}