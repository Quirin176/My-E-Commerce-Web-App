import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesModule } from '../categories/categories.module';
import { ProductFiltersModule } from '../product-filters/product-filters.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoriesModule, ProductFiltersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})

export class ProductsModule {}